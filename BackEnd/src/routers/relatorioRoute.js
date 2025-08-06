const express = require("express");
const router = express.Router();

const { home } = require("../controllers/relatoriosControllers");

// 🔒 Rota protegida - Relatório da home
router.get("/home", home);

module.exports = router;
