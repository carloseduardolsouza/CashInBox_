const vendaModels = require("../models/vendaModels");

/**
 * 💰 Cria uma nova venda à vista
 */
const novaVenda = async (req, res) => {
  try {
    const venda = await vendaModels.novaVenda(req.body);
    return res.status(201).json(venda);
  } catch (err) {
    console.error("Erro ao criar nova venda:", err);
    return res.status(500).json({ erro: "Erro ao criar nova venda" });
  }
};

/**
 * 💳 Cria uma nova venda a prazo (crediário)
 */
const novaVendaCrediario = async (req, res) => {
  try {
    const venda = await vendaModels.novaVendaCrediario(req.body);
    return res.status(201).json(venda);
  } catch (err) {
    console.error("Erro ao criar venda crediário:", err);
    return res.status(500).json({ erro: "Erro ao criar venda a prazo" });
  }
};

/**
 * 📋 Lista todas as vendas (com ou sem filtro)
 */
const listarVendas = async (req, res) => {
  try {
    const { filtro } = req.params;
    const vendas = await vendaModels.listarVendas(filtro);
    return res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao listar vendas:", err);
    return res.status(500).json({ erro: "Erro ao listar vendas" });
  }
};

/**
 * 📋 Lista as vendas feitas por um cliente
 */
const listarVendasCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const vendas = await vendaModels.listarVendasCliente(id);
    return res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao listar vendas por cliente:", err);
    return res.status(500).json({ erro: "Erro ao buscar vendas do cliente" });
  }
};

/**
 * 🧾 Lista as vendas crediário de uma venda específica
 */
const listarVendasCrediarioVenda = async (req, res) => {
  try {
    const { id } = req.params;
    const vendas = await vendaModels.listarVendasCrediarioVenda(id);
    return res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao listar crediário da venda:", err);
    return res.status(500).json({ erro: "Erro ao buscar venda a prazo" });
  }
};

/**
 * 💵 Receber pagamento de uma venda crediário
 */
const receberVendaCrediario = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;
    const vendas = await vendaModels.receberVendaCrediario(id, dados);
    return res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao receber venda crediário:", err);
    return res.status(500).json({ erro: "Erro ao registrar pagamento" });
  }
};

/**
 * 📋 Lista as vendas feitas por funcionário
 */
const listarVendasFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const vendas = await vendaModels.listarVendasFuncionario(id);
    return res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao listar vendas por funcionário:", err);
    return res
      .status(500)
      .json({ erro: "Erro ao buscar vendas do funcionário" });
  }
};

/**
 * 🔍 Lista todos os orçamentos com filtro e pesquisa
 */
const listarOrcamentos = async (req, res) => {
  try {
    const { filtro } = req.params;
    const orcamentos = await vendaModels.listarOrcamentos(filtro);
    return res.status(200).json(orcamentos);
  } catch (err) {
    console.error("Erro ao listar orçamentos:", err);
    return res.status(500).json({ erro: "Erro ao buscar orçamentos" });
  }
};

/**
 * 🧾 Lista os orçamentos de um cliente específico
 */
const listarOrcamentoCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const vendas = await vendaModels.listarOrcamentoCliente(id);
    return res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao listar orçamentos do cliente:", err);
    return res.status(500).json({ erro: "Erro ao buscar orçamentos" });
  }
};

/**
 * 💳 Lista todas as vendas a prazo com filtros
 */
const listarVendasCrediario = async (req, res) => {
  try {
    const vendas = await vendaModels.listarVendasCrediario();
    return res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao listar vendas crediário:", err);
    return res.status(500).json({ erro: "Erro ao buscar vendas a prazo" });
  }
};

/**
 * 💳 Lista as vendas a prazo de um cliente
 */
const listarVendasCrediarioCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const vendas = await vendaModels.listarVendasCrediarioCliente(id);
    return res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao listar crediários do cliente:", err);
    return res.status(500).json({ erro: "Erro ao buscar vendas do cliente" });
  }
};

/**
 * 🔎 Buscar venda por ID
 */
const procurarVendaId = async (req, res) => {
  try {
    const { id } = req.params;
    const venda = await vendaModels.procurarVendaId(id);
    return res.status(200).json(venda);
  } catch (err) {
    console.error("Erro ao procurar venda:", err);
    return res.status(500).json({ erro: "Erro ao buscar venda" });
  }
};

/**
 * 📦 Buscar produtos de uma venda
 */
const procurarProdutosVenda = async (req, res) => {
  try {
    const { id } = req.params;
    const produtos = await vendaModels.procurarProdutosVenda(id);
    return res.status(200).json(produtos);
  } catch (err) {
    console.error("Erro ao buscar produtos da venda:", err);
    return res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
};

/**
 * 💸 Buscar pagamentos de uma venda
 */
const procurarPagamentoVenda = async (req, res) => {
  try {
    const { id } = req.params;
    const pagamento = await vendaModels.procurarPagamentoVenda(id);
    return res.status(200).json(pagamento);
  } catch (err) {
    console.error("Erro ao buscar pagamento:", err);
    return res.status(500).json({ erro: "Erro ao buscar pagamento" });
  }
};

/**
 * ❌ Deletar uma venda pelo ID
 */
const deletarVenda = async (req, res) => {
  try {
    const { id } = req.params;
    const venda = await vendaModels.deletarVenda(id);
    return res.status(200).json(venda);
  } catch (err) {
    console.error("Erro ao deletar venda:", err);
    return res.status(500).json({ erro: "Erro ao deletar venda" });
  }
};

const amortizarParcela = async (req , res) => {
  try {
    const { id } = req.params;
    const parcela = await vendaModels.amortizarParcela(id , req.body);
    return res.status(200).json(parcela);
  } catch (err) {
    console.error("Erro ao deletar venda:", err);
    return res.status(500).json({ erro: "Erro ao deletar venda" });
  }
}

module.exports = {
  amortizarParcela,
  novaVenda,
  novaVendaCrediario,
  listarVendas,
  listarVendasCliente,
  listarOrcamentoCliente,
  listarVendasFuncionario,
  procurarVendaId,
  procurarProdutosVenda,
  procurarPagamentoVenda,
  deletarVenda,
  listarOrcamentos,
  receberVendaCrediario,
  listarVendasCrediario,
  listarVendasCrediarioVenda,
  listarVendasCrediarioCliente,
};
