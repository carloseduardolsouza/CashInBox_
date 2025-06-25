const express = require("express");
const router = express.Router();

const funcionariosControllers = require("../controllers/funcionariosControllers");

router.get("/:id", funcionariosControllers.procurarFuncionario);
router.post("/", funcionariosControllers.novoFuncionario);
router.delete("/:id", funcionariosControllers.deletarFuncionario);
router.put("/:id", funcionariosControllers.editarFuncionario);
router.get("/buscar/:id", funcionariosControllers.procurarFuncionarioId);

module.exports = router;
