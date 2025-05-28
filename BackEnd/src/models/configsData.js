const fs = require('fs');
const path = require('path');
const os = require('os');

// Caminho persistente (tipo Electron's app.getPath('userData'))
const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'CashInBox');
const dataFilePath = path.join(appDataPath, 'configsData.json');

// Garante que a pasta existe
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

// Função para ler os dados
function getConfigsData() {
  if (!fs.existsSync(dataFilePath)) {
    return null; // Ou retorna valores padrão, se quiser
  }

  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler configsData:', err.message);
    return null;
  }
}

// Função para salvar dados
function saveConfigsData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Erro ao salvar configsData:', err.message);
    return false;
  }
}

module.exports = {
  getConfigsData,
  saveConfigsData,
};
