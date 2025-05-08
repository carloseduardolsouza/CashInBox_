const produtosModels = require("../models/produtosModels");

const procurarProduto = async (req, res) => {
  const produtos = await produtosModels.listarCliente();
  return res.status(200).json(produtos);
};

const novoProduto = async (req, res) => {
  const produtos = await produtosModels.novoProduto(req.body);
  return res.status(201).json(produtos);
};

const editarProduto = async (req, res) => {
  const { id } = req.params;
  const editarProduto = await produtosModels.editarProduto(id, req.body);
  return res.status(200).json();
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;
  const deletarFuncionario = await produtosModels.deletarProduto(id);
  return res.status(200).json(deletarProduto);
};

const procurarProdutoId = async (req, res) => {
  const { id } = req.params;
  const procurarProdutoId = await produtosModels.procurarProdutoId(id);
  return res.status(200).json(procurarProdutoId);
};

module.exports = {
  procurarProduto,
  novoProduto,
  editarProduto,
  deletarProduto,
  procurarProdutoId,
};
