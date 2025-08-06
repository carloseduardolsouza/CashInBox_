const express = require("express");
const router = express.Router();

const contasController = require("../controllers/contasController");

router.get("/", contasController.contasAll);
router.post("/", contasController.novaConta);
router.put("/:id", contasController.editarConta);
router.put("/:id/pagar", contasController.pagarConta);
router.delete("/:id", contasController.deletarConta);

module.exports = router;