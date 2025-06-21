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

const authMiddleware = require("./middleware/authMiddleware");

// Rotas de clientes
router.get(
  "/clientes/:id",
  authMiddleware,
  clientesControllers.procurarCliente
);
router.post("/novoCliente", clientesControllers.novoCliente);
router.delete("/deletarCliente/:id", clientesControllers.deletarCliente);
router.put("/editarCliente/:id", clientesControllers.editarCliente);
router.get("/procurarClienteId/:id", clientesControllers.procurarClienteId);

// Rotas de funcionários
router.get("/funcionario/:id", funcionariosControllers.procurarFuncionario);
router.post("/novoFuncionario", funcionariosControllers.novoFuncionario);
router.delete(
  "/deletarFuncionario/:id",
  funcionariosControllers.deletarFuncionario
);
router.get(
  "/procurarFuncionarioId/:id",
  funcionariosControllers.procurarFuncionarioId
);
router.put("/editarFuncionario/:id", funcionariosControllers.editarFuncionario);

// Rotas de produtos
router.get(
  "/produtos/:id",
  authMiddleware,
  produtosControllers.procurarProduto
);
router.post(
  "/novoProduto",
  upload.array("imagens"),
  produtosControllers.novoProduto
);
router.post(
  "/novaImagemProduto/:id",
  upload.array("imagens"),
  produtosControllers.novaImagemProduto
);
router.put("/editarProduto/:id", produtosControllers.editarProduto);
router.delete("/deletarProduto/:id", produtosControllers.deletarProduto);
router.get("/procurarProdutoId/:id", produtosControllers.procurarProdutoId);
router.get("/imageProdutoId/:id", produtosControllers.procurarVariaçãoProdutos);
router.delete(
  "/deletarVariacaoProduto/:id",
  produtosControllers.deletarVariacaoProdutos
);

// Rotas de categorias
router.post("/novaCategoria", categoriasControllers.novaCategoria);
router.get("/categorias", categoriasControllers.listarCategorias);
router.delete("/deletarCategorias/:id", categoriasControllers.deletarCategoria);
router.get(
  "/procurarCategoriasId/:id",
  categoriasControllers.buscarCategoriaPorId
);
router.put("/editarCategorias/:id", categoriasControllers.editarCategoria);

// Rotas de vendas
router.post("/novaVenda", vendaControlles.NovaVenda);
router.post("/novaVendaCrediario", vendaControlles.NovaVendaCrediario);
router.get(
  "/listarVendas/:filtro?",
  authMiddleware,
  vendaControlles.listarVendas
);
router.get("/listarVendasCliente/:id", vendaControlles.listarVendasCliente);
router.get(
  "/listarVendasFuncionario/:id",
  vendaControlles.listarVendasFuncionario
);
router.get(
  "/listarOrcamentoCliente/:id",
  vendaControlles.listarOrcamentoCliente
);
router.get(
  "/listarVendasCrediarioVenda/:id",
  vendaControlles.listarVendasCrediarioVenda
);
router.put("/receberVendaCrediario/:id", vendaControlles.receberVendaCrediario);
router.get(
  "/listarOrcamentos/:filtro?/:pesquisa?",
  vendaControlles.listarOrcamentos
);
router.get(
  "/listarVendasCrediario/:filtro?/:pesquisa?",
  vendaControlles.listarVendasCrediario
);
router.get(
  "/listarVendasCrediarioCliente/:id",
  vendaControlles.listarVendasCrediarioCliente
);
router.get("/procurarVendaId/:id", vendaControlles.produrarVendaId);
router.get("/procurarProdutosVenda/:id", vendaControlles.procurarProdutosVenda);
router.get(
  "/procurarPagamentoVenda/:id",
  vendaControlles.procurarPagamentoVenda
);
router.delete("/deletarVenda/:id", vendaControlles.deletarVenda);

//Rotas caixa
router.get("/buscarCaixas", caixaControlles.buscarCaixas);
router.get("/buscarCaixasAbertos", caixaControlles.buscarCaixasAbertos);
router.post("/iniciarNovoCaixa", caixaControlles.iniciarNovoCaixa);
router.post(
  "/adicionarMovimentacoes/:id",
  caixaControlles.adicionarMovimentações
);
router.get("/buscarMovimentacoes/:id", caixaControlles.buscarMovimentações);
router.put("/fecharCaixa/:id", caixaControlles.fecharCaixa);

//usuario
router.get("/dadosEmpresa", authMiddleware, userController.getDados);
router.post("/salvarDadosEmpresa", authMiddleware, userController.salvarDados);

//configuraçõpes
router.get("/configuracoes", configController.getDados);
router.post("/salvarConfiguracoes", configController.salvarDados);

// Outras rotas
router.get("/restart", authMiddleware, services.restart);

router.get(
  "/faturamentoMes",
  authMiddleware,
  relatorios.calcularFaturamentoMensal
);

router.post("/EnviarMenssagemWhatsapp", automacao.enviarMensagem);
router.get("/qrCodeAutomacao", automacao.qrCode);

router.get("/informacoesPlano" , services.informacoesPlano)
router.get("/gerarBoleto" , services.gerarBoleto)

router.post("/login", services.login);

module.exports = router;
