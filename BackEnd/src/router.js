const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const os = require("os");

const router = express.Router();

// === Pasta persistente para uploads (na pasta do usuário) ===
const userDataPath = path.join(os.homedir(), "AppData", "Roaming", "CashInBox");
const uploadPath = path.join(userDataPath, "uploads");

// Garante que a pasta 'uploads' exista
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuração do Multer para salvar imagens com nomes únicos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Limpa o nome do arquivo
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${originalName}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Importa os controllers
const categoriasControllers = require("./controllers/categoriasControllers");
const clientesControllers = require("./controllers/clientesControllers");
const funcionariosControllers = require("./controllers/funcionariosControllers");
const produtosControllers = require("./controllers/produtosController");
const vendaControlles = require("./controllers/vendaControllers");
const userController = require("./controllers/userController");
const caixaControlles = require("./controllers/caixaControlles");
const services = require("./services/services");
const automacao = require("./services/automacao");
const relatorios = require("./services/relatorios");
const configController = require("./controllers/configController");

const authMiddleware = require("./middleware/authMiddleware")

// Rotas de clientes
router.get("/clientes/:id", authMiddleware, clientesControllers.procurarCliente);
router.post("/novoCliente", authMiddleware, clientesControllers.novoCliente);
router.delete("/deletarCliente/:id", authMiddleware, clientesControllers.deletarCliente);
router.put("/editarCliente/:id", authMiddleware, clientesControllers.editarCliente);
router.get("/procurarClienteId/:id", authMiddleware, clientesControllers.procurarClienteId);

// Rotas de funcionários
router.get("/funcionario/:id", authMiddleware, funcionariosControllers.procurarFuncionario);
router.post("/novoFuncionario", authMiddleware, funcionariosControllers.novoFuncionario);
router.delete(
  "/deletarFuncionario/:id", authMiddleware ,
  funcionariosControllers.deletarFuncionario
);
router.get(
  "/procurarFuncionarioId/:id", authMiddleware ,
  funcionariosControllers.procurarFuncionarioId
);
router.put("/editarFuncionario/:id", authMiddleware , funcionariosControllers.editarFuncionario);

// Rotas de produtos
router.get("/produtos/:id", authMiddleware , produtosControllers.procurarProduto);
router.post(
  "/novoProduto", authMiddleware ,
  upload.array("imagens"),
  produtosControllers.novoProduto
);
router.post(
  "/novaImagemProduto/:id", authMiddleware ,
  upload.array("imagens"),
  produtosControllers.novaImagemProduto
);
router.put("/editarProduto/:id", authMiddleware , produtosControllers.editarProduto);
router.delete("/deletarProduto/:id", authMiddleware , produtosControllers.deletarProduto);
router.get("/procurarProdutoId/:id", authMiddleware , produtosControllers.procurarProdutoId);
router.get("/imageProdutoId/:id", authMiddleware , produtosControllers.procurarVariaçãoProdutos);
router.delete(
  "/deletarVariacaoProduto/:id", authMiddleware ,
  produtosControllers.deletarVariacaoProdutos
);

// Rotas de categorias
router.post("/novaCategoria", authMiddleware , categoriasControllers.novaCategoria);
router.get("/categorias", authMiddleware , categoriasControllers.listarCategorias);
router.delete("/deletarCategorias/:id", authMiddleware , categoriasControllers.deletarCategoria);
router.get(
  "/procurarCategoriasId/:id", authMiddleware ,
  categoriasControllers.buscarCategoriaPorId
);
router.put("/editarCategorias/:id", authMiddleware , categoriasControllers.editarCategoria);

// Rotas de vendas
router.post("/novaVenda", authMiddleware , vendaControlles.NovaVenda);
router.post("/novaVendaCrediario", authMiddleware , vendaControlles.NovaVendaCrediario);
router.get("/listarVendas/:filtro?", authMiddleware , vendaControlles.listarVendas);
router.get("/listarVendasCliente/:id", authMiddleware , vendaControlles.listarVendasCliente);
router.get(
  "/listarVendasFuncionario/:id", authMiddleware ,
  vendaControlles.listarVendasFuncionario
);
router.get(
  "/listarOrcamentoCliente/:id", authMiddleware ,
  vendaControlles.listarOrcamentoCliente
);
router.get(
  "/listarVendasCrediarioVenda/:id", authMiddleware ,
  vendaControlles.listarVendasCrediarioVenda
);
router.put("/receberVendaCrediario/:id", authMiddleware , vendaControlles.receberVendaCrediario);
router.get(
  "/listarOrcamentos/:filtro?/:pesquisa?", authMiddleware ,
  vendaControlles.listarOrcamentos
);
router.get(
  "/listarVendasCrediario/:filtro?/:pesquisa?", authMiddleware ,
  vendaControlles.listarVendasCrediario
);
router.get("/procurarVendaId/:id", authMiddleware , vendaControlles.produrarVendaId);
router.get("/procurarProdutosVenda/:id", authMiddleware , vendaControlles.procurarProdutosVenda);
router.get(
  "/procurarPagamentoVenda/:id", authMiddleware ,
  vendaControlles.procurarPagamentoVenda
);
router.delete("/deletarVenda/:id", authMiddleware , vendaControlles.deletarVenda);

//Rotas caixa
router.get("/buscarCaixas", authMiddleware , caixaControlles.buscarCaixas);
router.get("/buscarCaixasAbertos", authMiddleware , caixaControlles.buscarCaixasAbertos);
router.post("/iniciarNovoCaixa", authMiddleware , caixaControlles.iniciarNovoCaixa);
router.post(
  "/adicionarMovimentacoes/:id", authMiddleware ,
  caixaControlles.adicionarMovimentações
);
router.get("/buscarMovimentacoes/:id", authMiddleware , caixaControlles.buscarMovimentações);
router.put("/fecharCaixa/:id", authMiddleware , caixaControlles.fecharCaixa);

//usuario
router.get("/dadosEmpresa", authMiddleware , userController.getDados);
router.post("/salvarDadosEmpresa", authMiddleware , userController.salvarDados);

//configuraçõpes
router.get("/configuracoes", authMiddleware , configController.getDados);
router.post("/salvarConfiguracoes", authMiddleware , configController.salvarDados);

// Outras rotas
router.get("/restart", authMiddleware , services.restart);

router.get("/faturamentoMes", authMiddleware , relatorios.calcularFaturamentoMensal);

router.post("/EnviarMenssagemWhatsapp", authMiddleware , automacao.enviarMensagem);
router.get("/qrCodeAutomacao", authMiddleware , automacao.qrCode);

router.post("/login", services.login)

module.exports = router;
