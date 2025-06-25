const express = require("express");
const router = express.Router();

const vendaControllers = require("../controllers/vendaControllers");
const authMiddleware = require("../middleware/authMiddleware");

/** ============================
 * 📦 ROTAS DE VENDAS
 * ============================ */

// 🆕 Criar nova venda à vista
router.post("/", vendaControllers.novaVenda);

// 🆕 Criar nova venda a prazo (crediário)
router.post("/crediario", vendaControllers.novaVendaCrediario);

// 🔍 Listar todas as vendas (com ou sem filtro)
router.get("/:filtro?", authMiddleware, vendaControllers.listarVendas);

// 🔍 Buscar uma venda pelo ID
router.get("/id/:id", vendaControllers.procurarVendaId);

// 🛒 Buscar produtos de uma venda
router.get("/produtos/:id", vendaControllers.procurarProdutosVenda);

// 💳 Buscar pagamentos da venda
router.get("/pagamento/:id", vendaControllers.procurarPagamentoVenda);

// ❌ Deletar uma venda pelo ID
router.delete("/:id", vendaControllers.deletarVenda);

/** ============================
 * 👤 VENDAS POR CLIENTE / FUNCIONÁRIO
 * ============================ */

// 📋 Vendas feitas por cliente
router.get("/cliente/:id", vendaControllers.listarVendasCliente);

// 📋 Vendas feitas por funcionário
router.get("/funcionario/:id", vendaControllers.listarVendasFuncionario);

/** ============================
 * 📑 ORÇAMENTOS
 * ============================ */

// 🔍 Orçamentos do cliente
router.get("/orcamento/cliente/:id", vendaControllers.listarOrcamentoCliente);

// 🔍 Listar orçamentos
router.post("/orcamentos", vendaControllers.listarOrcamentos);

/** ============================
 * 💳 VENDAS CREDIÁRIO
 * ============================ */

// 🔍 Todas vendas a prazo
router.get("/crediario/todas", vendaControllers.listarVendasCrediario);

// 🔍 Crediário por cliente
router.get(
  "/crediario/cliente/:id",
  vendaControllers.listarVendasCrediarioCliente
);

// 🔍 Venda a prazo específica (detalhada)
router.get("/crediario/venda/:id", vendaControllers.listarVendasCrediarioVenda);

// ✅ Receber valor de uma venda a prazo
router.put("/crediario/receber/:id", vendaControllers.receberVendaCrediario);

module.exports = router;
