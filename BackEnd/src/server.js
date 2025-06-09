// ✅ Carrega variáveis de ambiente antes de tudo
require("dotenv").config();

const rotinas = require("./services/rotinas")

const path = require("path");
const fs = require("fs");

// ✅ Recebe caminhos via argumentos
const databasePath = process.argv[2] || path.resolve(__dirname, "fallback.sqlite");
const uploadsPath = process.argv[3] || path.resolve(__dirname, "uploads");

// ✅ Garante que pasta de uploads exista
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 Pasta de uploads criada:", uploadsPath);
}

console.log("✅ Usando banco de dados em:", databasePath);
console.log("✅ Pasta de uploads:", uploadsPath);

// ✅ Garante que initDB e models saibam qual DB usar
process.env.DB_PATH = databasePath;

const app = require("./app");
require("./models/initDB");  // initDB deve usar process.env.DB_PATH ou similar

const PORT = process.env.PORT || 3322;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Aplicação de CashInBox rodando em http://localhost:${PORT}`);
  rotinas.verificarVencimentos()
});
