const express = require("express");
const router = express.Router();

const services = require("../services/services");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/informacoesPlano", services.informacoesPlano);
router.get("/gerarBoleto", services.gerarBoleto);

router.get("/dadosEmpresa", userController.getDados);
router.post("/editar/dadosEmpresa", authMiddleware, userController.salvarDados);
router.post("/config/automacao", userController.editarConfigAutomacao);
router.get("/config/automacao", userController.verConfigAutomacao);
router.post("/login", services.login);

module.exports = router;
