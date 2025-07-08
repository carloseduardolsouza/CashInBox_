const fs = require("fs");
const path = require("path");
const os = require("os");
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

const url = `https://cashinbox.shop`;

const platform = os.platform();
const baseAppDataDir =
  platform === "win32"
    ? path.join(os.homedir(), "AppData", "Roaming")
    : platform === "darwin"
    ? path.join(os.homedir(), "Library", "Application Support")
    : path.join(os.homedir(), ".config");

const secureDir = path.join(baseAppDataDir, "CashInBox");
const tokenFilePath = path.join(secureDir, "token.txt");
const camusqPath = path.join(secureDir, "camusq.json");

function ensureFiles() {
  if (!fs.existsSync(secureDir)) fs.mkdirSync(secureDir, { recursive: true });
  if (!fs.existsSync(tokenFilePath))
    fs.writeFileSync(tokenFilePath, "", "utf8");
}

function isAssinaturaVencida(dataVencimento) {
  const hoje = new Date().toISOString().split("T")[0];
  return dataVencimento < hoje;
}

function isLoginExpirado(ultimoLogin) {
  const hoje = new Date();
  const loginDate = new Date(ultimoLogin);
  const diffDias = Math.floor((hoje - loginDate) / (1000 * 60 * 60 * 24));
  return diffDias > 3;
}

function verificarCamusq(res, next) {
  if (!fs.existsSync(camusqPath)) {
    return res
      .status(403)
      .json({ message: "Acesso negado. Sem dados locais." });
  }

  const dados = JSON.parse(fs.readFileSync(camusqPath, "utf8"));

  if (isAssinaturaVencida(dados["data-vencimento"])) {
    return res.status(403).json({
      message: "Assinatura vencida. Por favor, renove sua assinatura.",
    });
  }

  if (dados["data-vencimento"] === "vencido") {
    return res.status(403).json({
      message: "Assinatura vencida. Por favor, renove sua assinatura.",
    });
  }

  if (isLoginExpirado(dados["ultimo-login"])) {
    return res
      .status(403)
      .json({ message: "Último login expirado. Refaça a autenticação." });
  }

  if (dados["data-vencimento"] === "usuario invalido") {
    return res.status(401).json({
      message: "Credenciais inválidas. Verifique seu email ou senha.",
    });
  }

  console.log(
    "⚠️ API falhou, mas dados locais estão válidos. Acesso liberado."
  );
  return next();
}

async function authMiddleware(req, res, next) {
  try {
    ensureFiles();
    const hoje = new Date().toISOString().split("T")[0];

    // Caminho do arquivo de credenciais
    const credPath = path.join(secureDir, "credenciais.json");

    // Lê e parseia as credenciais
    let dados;
    try {
      const credData = JSON.parse(fs.readFileSync(credPath, "utf8"));

      dados = {
        email: credData.email,
        senha: credData.senha,
      };
    } catch (err) {
      return res.status(401).json({ message: "Erro ao ler credenciais." });
    }

    const loginRes = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!loginRes.ok) {
      let errorData = {};
      try {
        errorData = await loginRes.json();
      } catch {
        // ignorar se não for JSON
      }

      if (
        loginRes.status === 401 &&
        errorData.message ===
          "Credenciais inválidas. Verifique seu email ou senha."
      ) {
        const usuarioInvalido = {
          "data-vencimento": "usuario invalido",
          "nivel-acesso": 0,
          "ultimo-login": hoje,
        };

        fs.writeFileSync(
          camusqPath,
          JSON.stringify(usuarioInvalido, null, 2),
          "utf8"
        );

        return res.status(403).json({
          message: "Assinatura vencida. Por favor, renove sua assinatura.",
        });
      }

      console.warn("❌ Login falhou. Tentando verificar pelo camusq.json...");
      return verificarCamusq(res, next);
    }

    const { token } = await loginRes.json();
    if (!token) {
      return res.status(500).json({ message: "Login OK, mas sem token." });
    }

    fs.writeFileSync(tokenFilePath, token, "utf8");
    console.log("🔑 Token atualizado e salvo.");

    const authRes = await fetch(`${url}/user/frequencia`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (authRes.ok) {
      const data = await authRes.json();

      const camusqData = {
        "data-vencimento": data.vencimento_assinatura,
        "nivel-acesso": data.nivel_acesso,
        "ultimo-login": hoje,
      };

      fs.writeFileSync(camusqPath, JSON.stringify(camusqData, null, 2), "utf8");
      console.log("📦 Dados da assinatura atualizados no camusq.json.");
      return next();
    } else {
      const responseData = await authRes.json().catch(() => ({}));
      const msg = responseData?.message || "Acesso negado.";

      if (msg === "Assinatura vencida. Por favor, renove sua assinatura.") {
        const vencidoData = {
          "data-vencimento": "vencido",
          "nivel-acesso": 0,
          "ultimo-login": hoje,
        };

        fs.writeFileSync(
          camusqPath,
          JSON.stringify(vencidoData, null, 2),
          "utf8"
        );
        console.warn("⛔ Assinatura vencida. Dados locais atualizados.");
        return res.status(403).json({ message: msg });
      }

      console.warn(
        "⚠️ Erro inesperado na API. Tentando verificar pelo camusq.json..."
      );
      return verificarCamusq(res, next);
    }
  } catch (err) {
    console.error("💥 Erro inesperado:", err.message);
    return verificarCamusq(res, next);
  }
}

module.exports = authMiddleware;
