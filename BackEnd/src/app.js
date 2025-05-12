//criar aplicaçao para o servidor e inserir as rotas
const express = require("express");
const router = require("./router");

const app = express();

// Adicionar os cabeçalhos Access-Control-Allow-Origin
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(router);

module.exports = app;