const express = require("express");
const router = express.Router();

const caixaController = require("../controllers/caixaController");

// === Rotas GET ===
router.get("/movimentacoes", caixaController.buscarMovimentacoes);

// === Rotas POST ===
router.post("/:id/movimentacoes", caixaController.adicionarMovimentacoes);

module.exports = router;
