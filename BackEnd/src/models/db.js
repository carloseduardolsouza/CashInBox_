const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const os = require('os');

// Caminho para a pasta segura do app (pasta persistente por usuário)
const userDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'CashInBox'); // Windows
const dbPath = path.join(userDataPath, 'database.sqlite');

// Caminho do banco original (aquele que vem com o app empacotado)
const originalDbPath = path.resolve(__dirname, '../../database.sqlite');

// Garante que a pasta existe
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

// Se ainda não existir o banco na pasta segura, copia do original
if (!fs.existsSync(dbPath)) {
  try {
    fs.copyFileSync(originalDbPath, dbPath);
    console.log('📁 Banco de dados copiado para pasta segura:', dbPath);
  } catch (err) {
    console.error('Erro ao copiar o banco de dados:', err.message);
  }
}

// Conecta ao banco na pasta segura
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('✅ Conectado ao SQLite em:', dbPath);
  }
});

module.exports = db;