const vendaModels = require("../models/vendaModels");

const NovaVenda = async (req, res) => {
  const venda = await vendaModels.NovaVenda(req.body);
  return res.status(201).json(venda);
};

const NovaVendaCrediario = async (req, res) => {
  const venda = await vendaModels.NovaVendaCrediario(req.body);
  return res.status(201).json(venda);
};

const listarVendas = async (req, res) => {
  const { filtro } = req.params;
  const vendas = await vendaModels.listarVendas(filtro);
  return res.status(201).json(vendas);
};

const listarVendasCliente = async (req, res) => {
  const { id } = req.params;
  const vendas = await vendaModels.listarVendasCliente(id);
  return res.status(201).json(vendas);
};

const listarVendasCrediarioVenda = async (req, res) => {
  const { id } = req.params;
  const vendas = await vendaModels.listarVendasCrediarioVenda(id);
  return res.status(201).json(vendas);
};

const receberVendaCrediario = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  const vendas = await vendaModels.receberVendaCrediario(id, dados);
  return res.status(201).json(vendas);
};

const listarOrcamentoCliente = async (req, res) => {
  const { id } = req.params;
  const vendas = await vendaModels.listarOrcamentoCliente(id);
  return res.status(201).json(vendas);
};

const listarVendasFuncionario = async (req, res) => {
  const { id } = req.params;
  const vendas = await vendaModels.listarVendasFuncionario(id);
  return res.status(201).json(vendas);
};

const listarOrcamentos = async (req, res) => {
  const { filtro, pesquisa } = req.params;
  const orcamentos = await vendaModels.listarOrcamentos(filtro, pesquisa);
  return res.status(201).json(orcamentos);
};

const listarVendasCrediario = async (req, res) => {
  const { filtro, pesquisa } = req.params;
  const vendas = await vendaModels.listarVendasCrediario(filtro, pesquisa);
  return res.status(201).json(vendas);
};

const produrarVendaId = async (req, res) => {
  const { id } = req.params;
  const vendas = await vendaModels.produrarVendaId(id);
  return res.status(201).json(vendas);
};

const procurarProdutosVenda = async (req, res) => {
  const { id } = req.params;
  const produtos = await vendaModels.procurarProdutosVenda(id);
  return res.status(201).json(produtos);
};

const procurarPagamentoVenda = async (req, res) => {
  const { id } = req.params;
  const pagamento = await vendaModels.procurarPagamentoVenda(id);
  return res.status(201).json(pagamento);
};

const deletarVenda = async (req, res) => {
  const { id } = req.params;
  const venda = await vendaModels.deletarVenda(id);
  return res.status(201).json(venda);
};

module.exports = {
  NovaVenda,
  NovaVendaCrediario,
  listarVendas,
  listarVendasCliente,
  listarOrcamentoCliente,
  listarVendasFuncionario,
  produrarVendaId,
  procurarProdutosVenda,
  procurarPagamentoVenda,
  deletarVenda,
  listarOrcamentos,
  receberVendaCrediario,
  listarVendasCrediario,
  listarVendasCrediarioVenda,
};
