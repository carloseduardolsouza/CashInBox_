const express = require("express");
const router = express.Router();

const relatorios = require("../controllers/relatoriosControllers");
const auth = require("../middleware/authMiddleware")

// 🔒 Rota protegida - Relatório da home
router.get("/home", auth , relatorios.home);
router.get("/resumoRelatorios", relatorios.resumoRelatorios);

module.exports = router;
