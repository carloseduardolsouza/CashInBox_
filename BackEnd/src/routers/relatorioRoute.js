const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { home } = require("../controllers/relatoriosControllers");

// 🔒 Rota protegida - Relatório da home
router.get("/home", authMiddleware, home);

module.exports = router;
