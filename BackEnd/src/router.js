const express = require("express");

const router = express.Router();

// Importa os controllers
const userController = require("./controllers/userController");

const services = require("./services/services");
const configController = require("./controllers/configController");

//usuario
router.get("/dadosEmpresa", authMiddleware, userController.getDados);
router.post("/salvarDadosEmpresa", authMiddleware, userController.salvarDados);
router.post("/login", services.login);

//configuraçõpes
router.get("/configuracoes", configController.getDados);
router.post("/salvarConfiguracoes", configController.salvarDados);

router.get("/informacoesPlano", services.informacoesPlano);
router.get("/gerarBoleto", services.gerarBoleto);


module.exports = router;
