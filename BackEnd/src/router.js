const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Garante que a pasta 'uploads' exista
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Configuração do armazenamento com multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Importa os controllers
const categoriasControllers = require('./controllers/categoriasControllers');
const clientesControllers = require('./controllers/clientesControllers');
const funcionariosControllers = require('./controllers/funcionariosControllers');
const produtosControllers = require('./controllers/produtosController');
const vendaControlles = require('./controllers/vendaControllers');
const services = require("./services/services");

// Rotas de clientes
router.get("/clientes/:id", clientesControllers.procurarCliente);
router.post("/novoCliente", clientesControllers.novoCliente);
router.delete("/deletarCliente/:id", clientesControllers.deletarCliente);
router.put("/editarCliente/:id", clientesControllers.editarCliente);
router.get("/procurarClienteId/:id", clientesControllers.procurarClienteId);

// Rotas de funcionários
router.get("/funcionario/:id", funcionariosControllers.procurarFuncionario);
router.post("/novoFuncionario", funcionariosControllers.novoFuncionario);
router.delete("/deletarFuncionario/:id", funcionariosControllers.deletarFuncionario);
router.get("/procurarFuncionarioId/:id", funcionariosControllers.procurarFuncionarioId);
router.put("/editarFuncionario/:id", funcionariosControllers.editarFuncionario);

// Rotas de produtos
router.get("/produtos/:id", produtosControllers.procurarProduto);
router.post("/novoProduto", upload.array('imagens'), produtosControllers.novoProduto);
router.put("/editarProduto/:id", produtosControllers.editarProduto);
router.delete("/deletarProduto/:id", produtosControllers.deletarProduto);
router.get("/procurarProdutoId/:id", produtosControllers.procurarProdutoId);
router.get("/imageProdutoId/:id", produtosControllers.procurarVariaçãoProdutos);
router.delete("/deletarVariacaoProduto/:id", produtosControllers.deletarVariacaoProdutos);

// Rotas de categorias
router.post("/novaCategoria", categoriasControllers.novaCategoria);
router.get("/categorias", categoriasControllers.listarCategorias);
router.delete("/deletarCategorias/:id", categoriasControllers.deletarCategoria);
router.get("/procurarCategoriasId/:id", categoriasControllers.buscarCategoriaPorId);
router.put("/editarCategorias/:id", categoriasControllers.editarCategoria);

// Rotas de vendas
router.post("/novaVenda", vendaControlles.NovaVenda);
router.get("/listarVendas/:filtro?/:pesquisa?", vendaControlles.listarVendas);
router.get("/listarOrcamentos/:filtro?/:pesquisa?", vendaControlles.listarOrcamentos);
router.get("/procurarVendaId/:id", vendaControlles.produrarVendaId);
router.get("/procurarProdutosVenda/:id", vendaControlles.procurarProdutosVenda);
router.delete("/deletarVenda/:id", vendaControlles.deletarVenda);

// Outras rotas
router.get("/restart", services.restart);

module.exports = router;
