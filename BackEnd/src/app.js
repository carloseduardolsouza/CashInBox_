// Criar aplicação para o servidor e inserir as rotas
const express = require("express");
const router = require("./router");
const path = require("path");
const os = require("os");

const app = express();

// === Middleware CORS ===
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// === Caminho absoluto da pasta persistente de uploads ===
const userDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'CashInBox');
const uploadPath = path.join(userDataPath, 'uploads');

// === Servir imagens públicas via /uploads ===
app.use('/uploads', express.static(uploadPath));

app.use(express.json());
app.use(router);

module.exports = app;
