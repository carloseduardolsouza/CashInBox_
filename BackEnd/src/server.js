//rodar o servidor
const app = require("./app");

const databasePath = process.argv[2] || "fallback.sqlite";
const uploadsPath = process.argv[3] || "uploads";

console.log("Usando banco de dados em:", databasePath);
console.log("Pasta de uploads:", uploadsPath);

require("dotenv").config();
require("./models/initDB");

const PORT = process.env.PORT || 3322;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Aplicação rodando em localhoost:${PORT}`);
});
