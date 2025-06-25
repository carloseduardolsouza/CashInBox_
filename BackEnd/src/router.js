const express = require("express");
const router = express.Router();

const services = require("./services/services");

router.get("/informacoesPlano", services.informacoesPlano);
router.get("/gerarBoleto", services.gerarBoleto);


module.exports = router;
