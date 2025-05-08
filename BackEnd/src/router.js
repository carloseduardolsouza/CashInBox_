//criar as rotas da api
const express = require("express");

const router = express.Router();

const clientesControllers = require('./controllers/clientesControllers')
const funcionariosControllers = require('./controllers/funcionariosControllers')

router.get("/clientes" , clientesControllers.procurarCliente)
router.post("/novoCliente" , clientesControllers.novoCliente)
router.delete("/deletarCliente/:id" , clientesControllers.deletarCliente)
router.put("/editarCliente/:id" , clientesControllers.editarCliente)
router.get("/procurarClienteId/:id" , clientesControllers.procurarClienteId)

router.get("/funcionario" , funcionariosControllers.procurarFuncionario)
router.post("/novoFuncionario" , funcionariosControllers.novoFuncionario)
router.delete("/deletarFuncionario/:id" , funcionariosControllers.deletarFuncionario)
router.get("/procurarFuncionarioId/:id" , funcionariosControllers.procurarFuncionarioId)

router.put("/editarFuncionario/:id" , funcionariosControllers.editarFuncionario)

module.exports = router;