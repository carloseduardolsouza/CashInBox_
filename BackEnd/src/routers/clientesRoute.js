const express = require("express");
const router = express.Router();

const clientesControllers = require("../controllers/clientesControllers");

// Base: /clientes

// === 🔒 Buscar cliente específico (com autenticação) ===
router.get("/:id",clientesControllers.procurarCliente);

// === 🆕 Criar novo cliente ===
router.post("/", clientesControllers.novoCliente);

// === 🗑️ Deletar cliente por ID ===
router.delete("/:id", clientesControllers.deletarCliente);

// === ✏️ Editar cliente por ID ===
router.put("/:id", clientesControllers.editarCliente);

// === 🔍 Buscar cliente por ID (caso queira uma rota pública sem autenticação) ===
// OBS: Essa rota pode ser redundante com GET /:id
router.get("/procurar/id/:id", clientesControllers.procurarClienteId);

module.exports = router;
