const express = require("express");
const router = express.Router();

const categoriasControllers = require("../controllers/categoriasControllers");

// Rotas de categorias — direto ao ponto, verbo RESTful no padrão
router.post("/", categoriasControllers.novaCategoria);
router.get("/", categoriasControllers.listarCategorias);
router.get("/:id", categoriasControllers.buscarCategoriaPorId);
router.put("/:id", categoriasControllers.editarCategoria);
router.delete("/:id", categoriasControllers.deletarCategoria);

module.exports = router;
