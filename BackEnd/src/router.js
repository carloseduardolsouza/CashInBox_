//criar as rotas da api
const express = require("express");
const multer = require("multer");

const router = express.Router();
const services = require("./services/services")


// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

// Inicialize o `multer` corretamente com a configuração de armazenamento
const upload = multer({ storage: storage });

const categoriasControllers = require('./controllers/categoriasControllers')
const clientesControllers = require('./controllers/clientesControllers')
const funcionariosControllers = require('./controllers/funcionariosControllers')
const produtosControllers = require('./controllers/produtosController')
const vendaControlles = require('./controllers/vendaControllers')

router.get("/clientes/:id" , clientesControllers.procurarCliente)
router.post("/novoCliente" , clientesControllers.novoCliente)
router.delete("/deletarCliente/:id" , clientesControllers.deletarCliente)
router.put("/editarCliente/:id" , clientesControllers.editarCliente)
router.get("/procurarClienteId/:id" , clientesControllers.procurarClienteId)

router.get("/funcionario/:id" , funcionariosControllers.procurarFuncionario)
router.post("/novoFuncionario" , funcionariosControllers.novoFuncionario)
router.delete("/deletarFuncionario/:id" , funcionariosControllers.deletarFuncionario)
router.get("/procurarFuncionarioId/:id" , funcionariosControllers.procurarFuncionarioId)
router.put("/editarFuncionario/:id" , funcionariosControllers.editarFuncionario)

router.get("/produtos/:id" , produtosControllers.procurarProduto)
router.post("/novoProduto" , upload.array('imagens') , produtosControllers.novoProduto)
router.put("/editarProduto/:id" , produtosControllers.editarProduto)
router.delete("/deletarProduto/:id" , produtosControllers.deletarProduto)
router.get("/procurarProdutoId/:id" , produtosControllers.procurarProdutoId)

router.get("/imageProdutoId/:id" , produtosControllers.procurarVariaçãoProdutos)
router.delete("/deletarVariacaoProduto/:id", produtosControllers.deletarVariacaoProdutos)

router.post("/novaCategoria" , categoriasControllers.novaCategoria)
router.get("/categorias" , categoriasControllers.listarCategorias)
router.delete("/deletarCategorias/:id" , categoriasControllers.deletarCategoria)
router.get("/procurarCategoriasId/:id" , categoriasControllers.buscarCategoriaPorId)
router.put("/editarCategorias/:id" , categoriasControllers.editarCategoria)

router.post("/novaVenda" , vendaControlles.NovaVenda)
router.get("/listarVendas/:filtro?/:pesquisa?" , vendaControlles.listarVendas)
router.get("/procurarVendaId/:id" , vendaControlles.produrarVendaId)
router.get("/procurarProdutosVenda/:id" , vendaControlles.procurarProdutosVenda)


router.get("/restart" , services.restart)
module.exports = router;