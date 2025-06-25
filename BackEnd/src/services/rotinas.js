const db = require("../models/db");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const {
  sanitizarNumero,
  temConexaoInternet,
  gerarMensagemCompra,
} = require("../whatsapp/utils");

const {
  client,
  esperarClientPronto,
  getStatusBot,
  getUltimoQRCode,
} = require("../whatsapp/client");

const statusPath = path.resolve(__dirname, "rotinasStatus.json");

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
      "SELECT * FROM crediario_parcelas WHERE data_vencimento <= ? AND status = 'pendente'",
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
          for (const cli of aniversariantes) {
            const mensagemFormatada = `🎉 Olá ${cli.nome}! Em comemoração a esta data muito especial, a equipe da *CashInBox* deseja um *feliz aniversário*! 🎂🎈

Pra celebrar com estilo, você ganha *10% de desconto em todos os itens da loja*, só hoje! 🛍️🎁

Aproveite e faça seu dia ainda melhor! 🥳`;
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

Pedimos que regularize o pagamento o quanto antes para evitar restrições no seu CPF e manter seu nome limpo. Qualquer dúvida estamos à disposição! 🤝

Atenciosamente,
Equipe CashInBox 💼`;

          console.log(`📞 Enviando cobrança para: ${nome} - ${telefone}`);
          await enviarMensagem(telefone, mensagemFormatada);
        }
      }

      resolve();
    });
  });
}

// === Execução completa ===
async function executarRotinasDiarias() {
  if (jaExecutouHoje()) {
    console.log("⏩ Rotinas já executadas hoje.");
    return;
  }

  console.log("🟡 Executando rotinas diárias...");

  await verificarVencimentos();
  await verificarAniversariantes();
  await cobrarPendencias()

  const hoje = dayjs().format("YYYY-MM-DD");
  salvarStatusRotinas(hoje);
  console.log("✅ Rotinas finalizadas e marcadas como executadas.");
}

// === Executa na inicialização ===
executarRotinasDiarias();

// === Agenda para rodar diariamente às 08:00 ===
cron.schedule("0 8 * * *", () => {
  console.log("⏰ Agendamento disparado (08:00)");
  executarRotinasDiarias();
});

// === Exportações ===
module.exports = {
  executarRotinasDiarias,
  verificarVencimentos,
  verificarAniversariantes,
  cobrarPendencias,
  enviarMensagem,
};
