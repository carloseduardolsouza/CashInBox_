const db = require("../models/db");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const os = require("os");

function substituirVariaveis(str, contexto) {
  return str.replace(/\$\{([\w.]+)\}/g, (_, chave) => {
    const props = chave.split(".");
    let valor = contexto;
    for (const prop of props) {
      valor = valor?.[prop];
      if (valor === undefined) return ""; // Se não existir, retorna vazio
    }
    return valor;
  });
}

function carregarUserConfigs() {
  const configPath = path.join(
    os.homedir(),
    "AppData",
    "Roaming",
    "CashInBox",
    "userConfigs.json"
  );
  if (!fs.existsSync(configPath)) {
    console.warn("⚠️ Arquivo userConfigs.json não encontrado.");
    return null;
  }

  try {
    const dados = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(dados);
  } catch (error) {
    console.error("❌ Erro ao carregar userConfigs:", error.message);
    return null;
  }
}

const { sanitizarNumero, temConexaoInternet } = require("../whatsapp/utils");

const {
  client,
  esperarClientPronto,
  getStatusBot,
  getUltimoQRCode,
} = require("../whatsapp/client");
const { config } = require("process");

const statusPath = path.join(
  os.homedir(),
  "AppData",
  "Roaming",
  "CashInBox",
  "rotinasStatus.json"
);

// === Funções auxiliares ===
function carregarStatusRotinas() {
  if (!fs.existsSync(statusPath)) {
    fs.writeFileSync(
      statusPath,
      JSON.stringify({ ultimaVerificacao: null }, null, 2)
    );
  }
  const dados = fs.readFileSync(statusPath, "utf-8");
  return JSON.parse(dados);
}

function salvarStatusRotinas(data) {
  fs.writeFileSync(
    statusPath,
    JSON.stringify({ ultimaVerificacao: data }, null, 2)
  );
}

function jaExecutouHoje() {
  const status = carregarStatusRotinas();
  const hoje = dayjs().format("YYYY-MM-DD");
  return status.ultimaVerificacao === hoje;
}

// === ROTINA 1 - Verificar Vencimentos ===
async function verificarVencimentos() {
  return new Promise((resolve) => {
    const hoje = dayjs().format("YYYY-MM-DD");
    console.log("📅 Verificando vencimentos em:", hoje);

    db.all(
      "SELECT * FROM crediario_parcelas WHERE data_vencimento < ? AND status = 'pendente'",
      [hoje],
      (err, rows) => {
        if (err) {
          console.error("❌ Erro ao buscar vencimentos:", err.message);
          return resolve();
        }

        if (rows.length === 0) {
          console.log("✅ Nenhuma conta vencida hoje.");
          return resolve();
        }

        let contador = 0;
        rows.forEach((conta) => {
          console.log(
            `⚠️ Conta vencida: ${conta.descricao || "Sem descrição"} - R$${
              conta.valor
            }`
          );
          db.run(
            "UPDATE crediario_parcelas SET status = 'vencido' WHERE id = ?",
            [conta.id],
            (err) => {
              if (err)
                console.error("❌ Erro ao atualizar status:", err.message);
              else console.log(`✔️ Conta ID ${conta.id} marcada como vencida.`);
              contador++;
              if (contador === rows.length) resolve();
            }
          );
        });
      }
    );
  });
}

// === Enviar Mensagem WhatsApp ===
async function enviarMensagem(numero, mensagemFormatada) {
  try {
    const online = await temConexaoInternet();
    if (!online) {
      console.log("🛑 Sem conexão com a internet para enviar mensagem.");
      return;
    }

    const numeroSanitizado = sanitizarNumero(numero);
    if (!numeroSanitizado) {
      console.log("⚠️ Número inválido fornecido:", numero);
      return;
    }

    await esperarClientPronto();

    if (!client.info || getStatusBot() !== "online") {
      console.log(
        "⚠️ Cliente WhatsApp ainda não está pronto mesmo após espera."
      );
      return;
    }

    const chatId = `${numeroSanitizado}@c.us`;
    console.log("🔍 Enviando mensagem para:", chatId);

    const isRegistered = await client.isRegisteredUser(chatId);
    if (!isRegistered) {
      console.log("⚠️ Número não está registrado no WhatsApp:", chatId);
      return;
    }

    await client.sendMessage(chatId, mensagemFormatada);

    console.log(`✅ Mensagem enviada para ${chatId}`);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.message);
  }
}

// === ROTINA 2 - Verificar Aniversariantes ===
async function verificarAniversariantes() {
  return new Promise((resolve) => {
    const hoje = dayjs().format("MM-DD");

    db.all(
      "SELECT nome, telefone, data_nascimento FROM clientes",
      [],
      async (err, rows) => {
        if (err) {
          console.error("❌ Erro ao buscar clientes:", err.message);
          return resolve();
        }

        const aniversariantes = rows.filter((cliente) => {
          if (!cliente.data_nascimento) return false;
          const nascimento = dayjs(cliente.data_nascimento).format("MM-DD");
          return nascimento === hoje;
        });

        if (aniversariantes.length === 0) {
          console.log("🎉 Nenhum aniversariante hoje.");
        } else {
          console.log("🎂 Aniversariantes do dia:");
          const configUser = carregarUserConfigs();
          for (const cli of aniversariantes) {
            const mensagemFormatada = substituirVariaveis(
              configUser.msg_msg_aniversario,
              cli
            );
            console.log(`🎈 ${cli.nome} - 📞 ${cli.telefone}`);
            await enviarMensagem(cli.telefone, mensagemFormatada);
          }
        }

        resolve();
      }
    );
  });
}

// === ROTINA 3 - Verificar Pendências ===
async function cobrarPendencias() {
  return new Promise((resolve) => {
    const query = `
      SELECT 
        cp.valor_parcela,
        cp.data_vencimento,
        cp.id_cliente,
        c.nome,
        c.telefone
      FROM crediario_parcelas cp
      JOIN clientes c ON cp.id_cliente = c.id
      WHERE cp.status = 'vencido'
    `;

    db.all(query, [], async (err, rows) => {
      if (err) {
        console.error("❌ Erro ao buscar pendências:", err.message);
        return resolve();
      }

      if (rows.length === 0) {
        console.log("✅ Nenhuma pendência vencida encontrada.");
      } else {
        console.log("📌 Pendências vencidas:");
        for (const row of rows) {
          const { nome, telefone, valor_parcela, data_vencimento } = row;

          const valorFormatado = Number(valor_parcela)
            .toFixed(2)
            .replace(".", ",");
          const vencimentoFormatado =
            dayjs(data_vencimento).format("DD/MM/YYYY");

          const mensagemFormatada = `Olá, ${nome}! 👋

Verificamos que você possui uma pendência em aberto referente ao crediário na nossa loja.

💰 *Valor da parcela:* R$ ${valorFormatado}
📅 *Vencimento:* ${vencimentoFormatado}

Pedimos que regularize o pagamento o quanto antes para evitar restrições no seu CPF e manter seu nome limpo. Qualquer dúvida estamos à disposição! 🤝`;

          console.log(`📞 Enviando cobrança para: ${nome} - ${telefone}`);
          await enviarMensagem(telefone, mensagemFormatada);
        }
      }

      resolve();
    });
  });
}

// === ROTINA 4 - Verificar Contas a Pagar ===
async function verificarContasPagar(numeroDestino) {
  const hoje = dayjs().format("YYYY-MM-DD");
  console.log("📌 Verificando contas a pagar para:", hoje);

  db.all(
    "SELECT id, categoria, valor_total, data_vencimento, status FROM contas_a_pagar WHERE data_vencimento <= ? AND status != 'pago'",
    [hoje],
    async (err, rows) => {
      if (err) {
        console.error("❌ Erro ao buscar contas a pagar:", err.message);
        return;
      }

      if (rows.length === 0) {
        console.log("✅ Nenhuma conta a pagar encontrada.");
        return;
      }

      for (const conta of rows) {
        const { id, categoria, data_vencimento, valor_total, status } = conta;
        const dataFormatada = dayjs(data_vencimento).format("DD/MM/YYYY");

        let mensagem = "";

        if (data_vencimento === hoje && status !== "vencida") {
          mensagem = `⚠️ *Lembrete de Vencimento* ⚠️

💼 Categoria: *${categoria}*  
💰 Valor: *R$ ${Number(valor_total).toFixed(2).replace(".", ",")}*  
📅 *Vencimento: Hoje*

Não se esqueça de realizar o pagamento *ainda hoje* para evitar multas, juros ou possíveis transtornos. 🚫💸`;
        } else {
          mensagem = `🚨 *Conta em Atraso* 🚨

💼 Categoria: *${categoria}*  
📅 Vencimento: *${dataFormatada}*  
💰 Valor: *R$ ${Number(valor_total).toFixed(2).replace(".", ",")}*

Identificamos que essa conta ainda *não foi paga*. 😕  
Pedimos que regularize o quanto antes para evitar multas, restrições ou interrupções no serviço. 💸`;

          // Atualiza status só se ainda não for "vencida"
          if (status !== "vencida") {
            db.run(
              "UPDATE contas_a_pagar SET status = 'vencida' WHERE id = ?",
              [id],
              (updateErr) => {
                if (updateErr) {
                  console.error(
                    `❌ Erro ao atualizar status da conta ID ${id}:`,
                    updateErr.message
                  );
                } else {
                  console.log(`✔️ Conta ID ${id} marcada como 'vencida'.`);
                }
              }
            );
          }
        }

        await enviarMensagem(numeroDestino, mensagem);
      }

      console.log("📨 Todas as mensagens de contas a pagar foram enviadas.");
    }
  );
}

// === Execução completa ===
async function executarRotinasDiarias(dados) {
  if (!dados || dados != "manualmente") {
    if (jaExecutouHoje()) {
      console.log("⏩ Rotinas já executadas hoje.");
      return;
    }
  }

  const config = carregarUserConfigs();
  if (!config) {
    console.log(
      "❌ Configurações não carregadas. Cancelando execução das rotinas."
    );
    return;
  }

  console.log("🟡 Executando rotinas diárias com config:", config);

  await verificarVencimentos();

  if (config.msg_aniversario) {
    await verificarAniversariantes();
  } else {
    console.log("🎂 Mensagem de aniversário desativada por config.");
  }

  if (config.msg_notificacao) {
    await verificarContasPagar(config.numero_msg_notificacao);
  } else {
    console.log("🔕 Notificações de contas desativadas por config.");
  }

  if (config.msg_cobranca) {
    await cobrarPendencias();
  } else {
    console.log("💸 Mensagem de cobrança desativada por config.");
  }

  const hoje = dayjs().format("YYYY-MM-DD");
  salvarStatusRotinas(hoje);
  console.log("✅ Rotinas finalizadas e marcadas como executadas.");
}

// === Executa na inicialização ===
executarRotinasDiarias();

const configRotina = carregarUserConfigs();

// Se não tiver horário definido, usa 08:00 como padrão
const horario = configRotina.time_msg_aniversario || "08:00";
const [hora, minuto] = horario.split(":");

// Validação leve (só pra garantir)
if (isNaN(hora) || isNaN(minuto)) {
  console.warn("⛔ Horário inválido no config! Usando 08:00 como fallback.");
}

// Monta o cron expression
const cronExpression = `${minuto} ${hora} * * *`;

console.log(
  `⏰ Agendamento configurado para ${hora}:${minuto} (${cronExpression})`
);

cron.schedule(cronExpression, () => {
  console.log(`⏰ Agendamento disparado (${hora}:${minuto})`);
  executarRotinasDiarias();
});

// === Exportações ===
module.exports = {
  executarRotinasDiarias,
  verificarContasPagar,
  verificarVencimentos,
  verificarAniversariantes,
  cobrarPendencias,
  enviarMensagem,
};
