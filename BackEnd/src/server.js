// ✅ Carrega variáveis de ambiente antes de tudo
require("dotenv").config();

// ✅ Ativa rotinas (ela se autoexecuta e agenda)
require("./services/rotinas");

const path = require("path");
const fs = require("fs");

const databasePath =
  process.argv[2] || path.resolve(__dirname, "fallback.sqlite");
const uploadsPath = process.argv[3] || path.resolve(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 Pasta de uploads criada:", uploadsPath);
}

console.log("✅ Usando banco de dados em:", databasePath);
console.log("✅ Pasta de uploads:", uploadsPath);

process.env.DB_PATH = databasePath;

const app = require("./app");
require("./models/initDB");

const PORT = process.env.PORT || 3322;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Aplicação de CashInBox rodando em http://localhost:${PORT}`);
});
