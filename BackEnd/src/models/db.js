const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// ✅ Recebe caminho do banco por ENV ou argumento
let dbPath = process.env.DB_PATH || process.argv[2];

if (!dbPath) {
  // Fallback: local dev
  const baseDir = path.resolve(__dirname, '../../');
  dbPath = path.join(baseDir, 'database.sqlite');
  console.warn('⚠️ DB_PATH não definido. Usando fallback:', dbPath);
} else {
  console.log('✅ Usando DB_PATH:', dbPath);
}

// ✅ Garante que a pasta do banco existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// ✅ Template DB: usa process.resourcesPath se empacotado
const isPackaged = process.mainModule?.filename.indexOf('app.asar') !== -1;

const templateDbPath = isPackaged
  ? path.join(process.resourcesPath, 'template-database.sqlite')
  : path.resolve(__dirname, '../../template-database.sqlite');

if (!fs.existsSync(dbPath) && fs.existsSync(templateDbPath)) {
  try {
    fs.copyFileSync(templateDbPath, dbPath);
    console.log('📁 Banco de dados copiado para:', dbPath);
  } catch (err) {
    console.error('❌ Erro ao copiar o banco:', err.message);
  }
}

// ✅ Conecta ao banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('✅ Conectado ao SQLite em:', dbPath);
  }
});

module.exports = db;
