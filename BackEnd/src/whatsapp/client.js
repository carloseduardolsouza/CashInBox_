const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcodeTerminal = require("qrcode-terminal");

// === Variáveis de estado internas ===
let statusBot = "offline";
let ultimoQRCode = null;
let qrTimeout = null;

// === Inicializa cliente WhatsApp com sessão local ===
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
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
  },
});

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

// === Funções de acesso ao estado ===
function getStatusBot() {
  return statusBot;
}

function getUltimoQRCode() {
  return ultimoQRCode;
}

function esperarClientPronto(timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    if (statusBot === "online") return resolve();

    const timeout = setTimeout(() => {
      reject(
        new Error(
          "⏳ Timeout: o cliente WhatsApp não ficou pronto em 30 segundos."
        )
      );
    }, timeoutMs);

    const onReady = () => {
      clearTimeout(timeout);
      resolve();
    };

    const onError = (err) => {
      clearTimeout(timeout);
      reject(new Error("❌ Erro ao inicializar o cliente: " + err.message));
    };

    const onAuthFailure = (msg) => {
      clearTimeout(timeout);
      reject(new Error("❌ Falha na autenticação: " + msg));
    };

    const onDisconnected = (reason) => {
      clearTimeout(timeout);
      reject(new Error("❌ Cliente foi desconectado: " + reason));
    };

    client.once("ready", onReady);
    client.once("error", onError);
    client.once("auth_failure", onAuthFailure);
    client.once("disconnected", onDisconnected);
  });
}

// === Exportações ===
module.exports = {
  client,
  esperarClientPronto,
  getStatusBot,
  getUltimoQRCode,
};
