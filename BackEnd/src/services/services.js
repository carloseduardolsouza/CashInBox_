const fs = require("fs");
const path = require("path");
const os = require("os");
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

// 📂 Diretórios base
const platform = os.platform();
const baseAppDataDir =
  platform === "win32"
    ? path.join(os.homedir(), "AppData", "Roaming")
    : platform === "darwin"
    ? path.join(os.homedir(), "Library", "Application Support")
    : path.join(os.homedir(), ".config");

const secureDir = path.join(baseAppDataDir, "CashInBox");
const tokenFilePath = path.join(secureDir, "token.txt");
const urlCloud = "http://localhost:7777"; // ou a URL real da sua API

// Pasta segura do app para dados do usuário (Windows)
const userDataPath = path.join(os.homedir(), "AppData", "Roaming", "CashInBox");

// Função para reiniciar a API (deixa como tá)
const restart = (req, res) => {
  const flagPath = path.resolve(__dirname, "../../restart.flag");
  fs.writeFileSync(flagPath, `Reiniciado em: ${new Date().toISOString()}`);
  console.log("API será reiniciada...");
  res.send("Reiniciando...");
  process.exit(0);
};

// Função para deletar imagem, usando versão async do unlink pra evitar callback hell
const deletarImagem = (nomeArquivo) => {
  const caminhoImagem = path.join(userDataPath, "uploads", nomeArquivo);
  console.log("Tentando deletar:", caminhoImagem);

  if (fs.existsSync(caminhoImagem)) {
    fs.unlink(caminhoImagem, (err) => {
      if (err) {
        console.error("Erro ao deletar imagem:", err);
      } else {
        console.log("Imagem deletada com sucesso:", nomeArquivo);
      }
    });
  } else {
    console.warn("Arquivo não encontrado:", nomeArquivo);
  }
};

const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  // Garante que a pasta segura exista
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }

  const caminhoCredenciais = path.join(userDataPath, "credenciais.json");
  const dados = { email, senha };

  try {
    // Escreve sempre, sobrescrevendo se o arquivo já existir
    fs.writeFileSync(caminhoCredenciais, JSON.stringify(dados, null, 2));
    console.log("Credenciais salvas ou atualizadas em:", caminhoCredenciais);
    res.status(200).json({ mensagem: "Credenciais salvas com sucesso." });
  } catch (err) {
    console.error("Erro ao salvar credenciais:", err);
    res.status(500).json({ erro: "Erro ao salvar credenciais." });
  }
};

const informacoesPlano = async (req, res) => {
  // Caminho do arquivo de credenciais
  const credPath = path.join(secureDir, "credenciais.json");

  let dados;
  try {
    const credData = JSON.parse(fs.readFileSync(credPath, "utf8"));

    dados = {
      email: credData.email,
      senha: credData.senha,
    };
  } catch (err) {
    return res.status(403).json({ message: "Faça seu login." });
  }

  // 📥 Leitura do token
  let token;
  try {
    token = fs.readFileSync(tokenFilePath, "utf8").trim();
    if (!token) throw new Error("Token vazio");
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token não encontrado. Faça seu login." });
  }

  // 🔐 Requisição autenticada
  try {
    const authRes = await fetch(`${urlCloud}/user/informacoesPlano`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!authRes.ok) {
      const msg = await authRes.text();
      return res.status(authRes.status).json({ message: msg });
    }

    const json = await authRes.json();
    return res.json(json);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar informações do plano." });
  }
};

const gerarBoleto = async (req , res) => {
  // Caminho do arquivo de credenciais
  const credPath = path.join(secureDir, "credenciais.json");

  let dados;
  try {
    const credData = JSON.parse(fs.readFileSync(credPath, "utf8"));

    dados = {
      email: credData.email,
      senha: credData.senha,
    };
  } catch (err) {
    return res.status(403).json({ message: "Faça seu login." });
  }

  // 📥 Leitura do token
  let token;
  try {
    token = fs.readFileSync(tokenFilePath, "utf8").trim();
    if (!token) throw new Error("Token vazio");
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token não encontrado. Faça seu login." });
  }

  // 🔐 Requisição autenticada
  try {
    const authRes = await fetch(`${urlCloud}/user/gerarBoleto`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!authRes.ok) {
      const msg = await authRes.text();
      return res.status(authRes.status).json({ message: msg });
    }

    const json = await authRes.json();
    return res.json(json);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar informações do plano." });
  }
}

module.exports = {
  restart,
  deletarImagem,
  login,
  informacoesPlano,
  gerarBoleto
};
