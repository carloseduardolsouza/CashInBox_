const express = require("express");
const router = require("./router");
const path = require("path");
const os = require("os");

const { verificarVencimentos } = require("./services/rotinas");

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
const userDataPath = path.join(os.homedir(), "AppData", "Roaming", "CashInBox");
const uploadPath = path.join(userDataPath, "uploads");

// === Servir imagens públicas via /uploads ===
app.use("/uploads", express.static(uploadPath));

// === Middleware para JSON ===
app.use(express.json());

// === Rotas ===
app.use(router);

app.use(verificarVencimentos)

module.exports = app;
