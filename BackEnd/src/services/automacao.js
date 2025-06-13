const QRCode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcodeTerminal = require("qrcode-terminal");
const dns = require("dns");

// Função para verificar se há conexão com a internet
const temConexaoInternet = () => {
  return new Promise((resolve) => {
    dns.lookup("google.com", (err) => {
      resolve(!err);
    });
  });
};

// Função para gerar mensagem de compra
function gerarMensagemCompra(dados) {
  if (dados.tipo === "venda") {
    let mensagem = `🧾 Detalhes da sua compra:\n\n`;
    mensagem += `👤 Cliente: ${dados.cliente}\n`;
    mensagem += `📄 Nº da Venda: ${dados.numero_venda}\n\n`;
    mensagem += `💰 Total Bruto: ${dados.valores.total_bruto}\n`;
    mensagem += `🔻 Descontos: ${dados.valores.descontos}\n`;
    mensagem += `🔺 Acréscimos: ${dados.valores.acrescimos}\n\n`;
    mensagem += `📦 Produtos:\n\n`;

    dados.produtos.forEach((prod) => {
      mensagem += `- ${prod.nome} — ${prod.quantidade} un. — Total: ${prod.total}\n`;
    });

    mensagem += `\n✅ Valor Total da Compra: ${dados.valor_total_compra}`;

    return mensagem;
  } else if (dados.tipo === "orçamento") {
    let mensagem = `🧾 Detalhes do seu orçamento:\n\n`;
    mensagem += `👤 Cliente: ${dados.cliente}\n`;
    mensagem += `💰 Total Bruto: ${dados.valores.total_bruto}\n`;
    mensagem += `🔻 Descontos: ${dados.valores.descontos}\n`;
    mensagem += `🔺 Acréscimos: ${dados.valores.acrescimos}\n\n`;
    mensagem += `📦 Produtos:\n\n`;

    dados.produtos.forEach((prod) => {
      mensagem += `- ${prod.nome} — ${prod.quantidade} un. — Total: ${prod.total}\n`;
    });

    mensagem += `\n✅ Valor Total: ${dados.valor_total_compra}`;

    return mensagem;
  }
}

// Inicializa cliente WhatsApp com sessão local
const client = new Client({
  authStrategy: new LocalAuth(),
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
    "--disable-gpu",
    "--window-size=1920,1080",
  ],
});

// Status do Bot
let statusBot = "offline";
let ultimoQRCode = null;
let qrTimeout = null;

// === Eventos do cliente ===

client.on("qr", (qr) => {
  console.log("📲 Escaneia esse QR Code com seu WhatsApp:");
  qrcodeTerminal.generate(qr, { small: true });
  ultimoQRCode = qr;
  statusBot = "aguardando conexão";

  if (qrTimeout) clearTimeout(qrTimeout);
  qrTimeout = setTimeout(() => {
    if (statusBot !== "online") {
      console.log("⚠️ Não conectado após 2 minutos. Reinicializando...");
      client.destroy().then(() => client.initialize());
    }
  }, 2 * 60 * 1000);
});

client.on("ready", () => {
  statusBot = "online";
  ultimoQRCode = null;
  console.log("✅ Bot está pronto e conectado!");
  if (qrTimeout) clearTimeout(qrTimeout);
});

client.on("disconnected", (reason) => {
  statusBot = "offline";
  ultimoQRCode = null;
  console.log(`❌ Bot foi desconectado! Motivo: ${reason}`);
  setTimeout(() => client.initialize(), 5000);
});

client.on("auth_failure", (msg) => {
  statusBot = "offline";
  ultimoQRCode = null;
  console.error("❌ Falha na autenticação:", msg);
});

client.on("error", (error) => {
  statusBot = "erro";
  console.error("❌ Erro no cliente WhatsApp:", error);
});

// === Funções de API ===

const qrCode = async (req, res) => {
  try {
    const online = await temConexaoInternet();
    if (!online) {
      return res.status(503).json({
        error: "🛑 Sem conexão com a internet",
        status_bot: "offline",
      });
    }

    if (statusBot === "online") {
      return res.status(200).json({
        status_bot: statusBot,
        mensagem_status: "✅ Bot já está conectado",
        qr_code: null,
        ultima_atualizacao: new Date().toISOString(),
      });
    }

    if (!ultimoQRCode) {
      return res.status(404).json({
        error:
          "Nenhum QR Code disponível no momento. Aguarde o bot gerar ou reinicie.",
        status_bot: statusBot,
      });
    }

    const qrCodeBase64 = await QRCode.toDataURL(ultimoQRCode);

    return res.json({
      status_bot: statusBot,
      mensagem_status: "🔄 Bot aguardando escaneamento do QR Code",
      qr_code: qrCodeBase64,
      ultima_atualizacao: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro ao gerar QR Code:", error);
    return res.status(500).json({
      error: "Erro ao gerar QR Code",
      details: error.message,
    });
  }
};

// Função utilitária para sanitizar número
const sanitizarNumero = (numero) => {
  let limpo = numero.replace(/\D/g, "");
  if (!limpo.startsWith("55")) {
    limpo = `55${limpo}`;
  }
  return limpo;
};

const enviarMensagem = async (req, res) => {
  try {
    const online = await temConexaoInternet();
    if (!online) {
      return res.status(503).json({ error: "🛑 Sem conexão com a internet" });
    }

    if (!client.info || statusBot !== "online") {
      return res
        .status(503)
        .json({ error: "Cliente WhatsApp ainda não está pronto" });
    }

    const { numero, mensagem } = req.body;

    if (!numero || !mensagem) {
      return res
        .status(400)
        .json({ error: "Número e mensagem são obrigatórios" });
    }

    const numeroSanitizado = sanitizarNumero(numero);
    const chatId = `${numeroSanitizado}@c.us`;

    console.log("🔍 Enviando mensagem para:", chatId);

    const isRegistered = await client.isRegisteredUser(chatId);
    if (!isRegistered) {
      return res
        .status(404)
        .json({ error: "Número não está registrado no WhatsApp" });
    }

    const mensagemFormatada = gerarMensagemCompra(mensagem);

    await client.sendMessage(chatId, mensagemFormatada);

    return res.json({
      success: true,
      message: "✅ Mensagem enviada com sucesso!",
    });
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error);
    return res.status(500).json({
      error: "Falha ao enviar mensagem",
      details: error.message,
    });
  }
};

// Inicializa o cliente com verificação de internet
(async () => {
  try {
    const online = await temConexaoInternet();
    if (!online) {
      console.error("❌ Sem internet. Cliente não inicializado.");
      return;
    }

    await client.initialize();
  } catch (error) {
    console.error("❌ Erro ao inicializar o cliente:", error);
    setTimeout(async () => {
      const online = await temConexaoInternet();
      if (online) client.initialize();
      else console.log("⚠️ Ainda sem internet, tentando novamente depois...");
    }, 5000);
  }
})();

// Exporta funções
module.exports = {
  qrCode,
  enviarMensagem,
};
