const QRCode = require("qrcode");
const {
  sanitizarNumero,
  temConexaoInternet,
  gerarMensagemCompra,
} = require("./utils");

const { client, getStatusBot, getUltimoQRCode } = require("./client");

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

    if (getStatusBot() === "online") {
      return res.status(200).json({
        status_bot: getStatusBot(),
        mensagem_status: "✅ Bot já está conectado",
        qr_code: null,
        ultima_atualizacao: new Date().toISOString(),
      });
    }

    const qr = getUltimoQRCode();
    if (!qr) {
      return res.status(404).json({
        error:
          "Nenhum QR Code disponível no momento. Aguarde o bot gerar ou reinicie.",
        status_bot: getStatusBot(),
      });
    }

    const qrCodeBase64 = await QRCode.toDataURL(qr);

    return res.json({
      status_bot: getStatusBot(),
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

const enviarMensagem = async (req, res) => {
  try {
    const online = await temConexaoInternet();
    if (!online) {
      return res.status(503).json({ error: "🛑 Sem conexão com a internet" });
    }

    if (!client.info || getStatusBot() !== "online") {
      return res
        .status(503)
        .json({ error: "Cliente WhatsApp ainda não está pronto" });
    }

    const { numero, mensagem, tipo } = req.body;

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

    const mensagemFormatada = gerarMensagemCompra(mensagem, tipo);

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

// === Inicializa o cliente com verificação de internet ===
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

// === Exporta funções ===
module.exports = {
  qrCode,
  enviarMensagem,
};
