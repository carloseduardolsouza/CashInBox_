const QRCode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcodeTerminal = require("qrcode-terminal");

function gerarMensagemCompra(dados) {
  let mensagem = `🧾 Detalhes da sua compra:\n\n`;
  mensagem += `👤 Cliente: ${dados.cliente}\n`;
  mensagem += `📄 Nº da Venda: ${dados.numero_venda}\n\n`;
  mensagem += `💰 Total Bruto: ${dados.valores.total_bruto}\n`;
  mensagem += `🔻 Descontos: ${dados.valores.descontos}\n`;
  mensagem += `🔺 Acréscimos: ${dados.valores.acrescimos}\n\n`;
  mensagem += `📦 Produtos:\n\n`;

  dados.produtos.forEach(prod => {
    mensagem += `- ${prod.nome} — ${prod.quantidade} un. — Total: ${prod.total}\n`;
  });

  mensagem += `\n✅ Valor Total da Compra: ${dados.valor_total_compra}`;

  return mensagem;
}


// Inicializa cliente WhatsApp com sessão local
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true, // Evita travamentos gráficos
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Status do Bot
let statusBot = "offline";
let ultimoQRCode = null;

// === Eventos do cliente ===

// QR Code gerado
client.on("qr", (qr) => {
  console.log("📲 Escaneia esse QR Code com seu WhatsApp:");
  qrcodeTerminal.generate(qr, { small: true });
  ultimoQRCode = qr;
  statusBot = "aguardando conexão";
});

// Cliente pronto
client.on("ready", () => {
  statusBot = "online";
  console.log("✅ Bot está pronto e conectado!");
});

// Cliente desconectado
client.on("disconnected", (reason) => {
  statusBot = "offline";
  console.log(`❌ Bot foi desconectado! Motivo: ${reason}`);
  // Opcional: reiniciar o client em caso de desconexão
  // setTimeout(() => client.initialize(), 5000);
});

// Falha na autenticação
client.on("auth_failure", (msg) => {
  statusBot = "offline";
  console.error("❌ Falha na autenticação:", msg);
});

// Erro geral
client.on("error", (error) => {
  console.error("❌ Erro no cliente WhatsApp:", error);
});

// === Endpoints ===

// Gera QR Code via API
const qrCode = async (req, res) => {
  try {
    if (!ultimoQRCode) {
      return res.status(404).json({ error: "Nenhum QR Code disponível no momento." });
    }

    const qrCodeBase64 = await QRCode.toDataURL(ultimoQRCode);
    const mensagemStatus = statusBot === "online" ? "✅ Bot em funcionamento" : "❌ Bot fora do ar";

    return res.json({
      status_bot: statusBot,
      mensagem_status: mensagemStatus,
      qr_code: qrCodeBase64,
      ultima_atualizacao: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro ao gerar QR Code:", error);
    return res.status(500).json({ error: "Erro ao gerar QR Code" });
  }
};

// Envia mensagem via WhatsApp
const enviarMensagem = async (req, res) => {
  try {
    if (!client.info || statusBot !== "online") {
      return res.status(503).json({ error: "Cliente WhatsApp ainda não está pronto" });
    }

    const { numero, mensagem } = req.body;

    if (!numero || !mensagem) {
      return res.status(400).json({ error: "Número e mensagem são obrigatórios" });
    }

    // Sanitiza e adiciona DDI do Brasil se não tiver
    const sanitizarNumero = (numero) => {
      let limpo = numero.replace(/\D/g, "");
      if (!limpo.startsWith("55")) {
        limpo = `55${limpo}`;
      }
      return limpo;
    };

    const numeroSanitizado = sanitizarNumero(numero);
    const chatId = `${numeroSanitizado}@c.us`;

    console.log("🔍 Enviando mensagem para:", chatId);

    const isRegistered = await client.isRegisteredUser(chatId);
    if (!isRegistered) {
      return res.status(404).json({ error: "Número não está registrado no WhatsApp" })
    }

    const menssagemFormatada = gerarMensagemCompra(mensagem)

    await client.sendMessage(chatId, menssagemFormatada);

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

// Inicializa o cliente
(async () => {
  try {
    await client.initialize();
  } catch (error) {
    console.error("❌ Erro ao inicializar o cliente:", error);
  }
})();

module.exports = {
  qrCode,
  enviarMensagem,
};
