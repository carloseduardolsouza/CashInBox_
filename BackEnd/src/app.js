const express = require("express");
const path = require("path");
const os = require("os");

const caixaRoute = require("./routers/caixaRoute");
const clientesRoute = require("./routers/clientesRoute");
const funcionarioRoute = require("./routers/funcionarioRoute");
const vendaRoute = require("./routers/vendaRoute");
const categoriaRoute = require("./routers/categoriaRoute");
const produtoRoute = require("./routers/produtoRoute");
const relatorioRoute = require("./routers/relatorioRoute");
const whatsappRoute = require("./routers/whatsappRoute");
const userEditRoute = require("./routers/userEditRoute");
const contasRoute = require("./routers/contasRoute");
const nfeRoute = require("./routers/nfeRoutes");

const app = express();

/* ===========================================
 * 🌐 Middleware CORS – Libera acesso externo
 * =========================================== */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/* ========================================================
 * 📁 Configuração do caminho de uploads (pasta persistente)
 * ======================================================== */
const userDataPath = path.join(os.homedir(), "AppData", "Roaming", "CashInBox");
const uploadPath = path.join(userDataPath, "uploads");

/* ========================================
 * 🖼️ Servir arquivos estáticos de uploads
 * ======================================== */
app.use("/uploads", express.static(uploadPath));

/* =========================
 * 🧠 Middleware Body Parser
 * ========================= */
app.use(express.json());

/* ===============
 * 🔁 Rotas da API
 * =============== */
app.use("/caixa", caixaRoute);
app.use("/clientes", clientesRoute);
app.use("/funcionarios", funcionarioRoute);
app.use("/vendas", vendaRoute);
app.use("/produtos", produtoRoute);
app.use("/categorias", categoriaRoute);
app.use("/relatorios", relatorioRoute);
app.use("/whatsapp", whatsappRoute);
app.use("/user", userEditRoute);
app.use("/contas", contasRoute);
app.use("/nfe", nfeRoute);

module.exports = app;
