const contasModels = require("../models/contasModels");

// 👉 Criar nova conta
const novaConta = async (req, res) => {
  try {
    const dados = req.body;
    const contaCriada = await contasModels.novaConta(dados);
    res.status(201).json(contaCriada);
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    res.status(500).json({ erro: "Erro ao criar conta" });
  }
};

// 👉 Listar todas as contas
const contasAll = async (req, res) => {
  try {
    const contas = await contasModels.contasAll();
    res.status(200).json(contas);
  } catch (error) {
    console.error("Erro ao listar contas:", error);
    res.status(500).json({ erro: "Erro ao listar contas" });
  }
};

// 👉 Editar conta
const editarConta = async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;
    const resultado = await contasModels.editarConta(id, dadosAtualizados);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao editar conta:", error);
    res.status(500).json({ erro: "Erro ao editar conta" });
  }
};

// 👉 Marcar conta como paga
const pagarConta = async (req, res) => {
  try {
    const id = req.params.id;
    const { data_pagamento } = req.body;

    const resultado = await contasModels.pagarConta(id, data_pagamento);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao pagar conta:", error);
    res.status(500).json({ erro: "Erro ao pagar conta" });
  }
};

// 👉 Deletar conta
const deletarConta = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await contasModels.deletarConta(id);
    res.status(200).json({ mensagem: "Conta excluída com sucesso", resultado });
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    res.status(500).json({ erro: "Erro ao deletar conta" });
  }
};

module.exports = {
  novaConta,
  contasAll,
  pagarConta,
  editarConta,
  deletarConta,
};
