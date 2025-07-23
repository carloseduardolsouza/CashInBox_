const fs = require("fs");
const path = require("path");
const os = require("os");

// Caminho persistente (tipo Electron's app.getPath('userData'))
const appDataPath = path.join(os.homedir(), "AppData", "Roaming", "CashInBox");

// Garante que a pasta exista
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

// Caminhos dos arquivos persistentes
const dataFilePath = path.join(appDataPath, "userData.json");
const dataFileConfigPath = path.join(appDataPath, "userConfigs.json");
const dataFileVendasPath = path.join(appDataPath, "vendasConfig.json");

// Função para ler os dados
function verConfigAutomacao() {
  if (!fs.existsSync(dataFileConfigPath)) {
    return null; // Ou retorna valores padrão, se quiser
  }

  try {
    const data = fs.readFileSync(dataFileConfigPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler userConfigs:", err.message);
    return null;
  }
}

// Função para ler os dados
function getUserData() {
  if (!fs.existsSync(dataFilePath)) {
    return null; // Ou retorna valores padrão, se quiser
  }

  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler userData:", err.message);
    return null;
  }
}

// Função para salvar dados
function saveUserData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Erro ao salvar userData:", err.message);
    return false;
  }
}

// Função para salvar dados
function editarConfigAutomacao(data) {
  try {
    fs.writeFileSync(
      dataFileConfigPath,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    return true;
  } catch (err) {
    console.error("Erro ao salvar userData:", err.message);
    return false;
  }
}

// Função para ler vendasConfig
function verConfigVendas() {
  if (!fs.existsSync(dataFileVendasPath)) {
    return;
  }

  try {
    const data = fs.readFileSync(dataFileVendasPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler vendasConfig:", err.message);
    return defaultVendasConfig;
  }
}

// Função para editar vendasConfig
function editarConfigVendas(data) {
  try {
    const config = {
      abertura_senha:
        typeof data.abertura_senha !== "undefined"
          ? data.abertura_senha
          : defaultVendasConfig.abertura_senha,
      abertura_caixa:
        typeof data.abertura_caixa !== "undefined"
          ? data.abertura_caixa
          : defaultVendasConfig.abertura_caixa,
      fechamento_caixa:
        typeof data.fechamento_caixa !== "undefined"
          ? data.fechamento_caixa
          : defaultVendasConfig.fechamento_caixa,
      formas_pagamentos:
        data.formas_pagamentos && Array.isArray(data.formas_pagamentos)
          ? data.formas_pagamentos
          : defaultVendasConfig.formas_pagamentos,
      limite_desconto:
        typeof data.limite_desconto === "number"
          ? data.limite_desconto
          : defaultVendasConfig.limite_desconto,
    };

    fs.writeFileSync(
      dataFileVendasPath,
      JSON.stringify(config, null, 2),
      "utf-8"
    );
    return true;
  } catch (err) {
    console.error("Erro ao salvar vendasConfig:", err.message);
    return false;
  }
}

module.exports = {
  getUserData,
  saveUserData,
  editarConfigAutomacao,
  verConfigAutomacao,
  verConfigVendas,
  editarConfigVendas,
};
