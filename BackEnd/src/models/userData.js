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

module.exports = {
  getUserData,
  saveUserData,
  editarConfigAutomacao,
  verConfigAutomacao,
};
