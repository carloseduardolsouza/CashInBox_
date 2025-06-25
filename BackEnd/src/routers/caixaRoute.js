const express = require("express");
const router = express.Router();

const caixaController = require("../controllers/caixaController");

// === Rotas GET ===
router.get("/", caixaController.buscarCaixas);
router.get("/abertos", caixaController.buscarCaixasAbertos);
router.get("/:id/movimentacoes", caixaController.buscarMovimentacoes);

// === Rotas POST ===
router.post("/", caixaController.iniciarNovoCaixa);
router.post("/:id/movimentacoes", caixaController.adicionarMovimentacoes);

// === Rotas PUT ===
router.put("/:id/fechar", caixaController.fecharCaixa);

module.exports = router;
