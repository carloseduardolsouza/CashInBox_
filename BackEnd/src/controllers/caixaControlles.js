const caixaModels = require("../models/caixaModels");

const iniciarNovoCaixa = async (req , res) => {
    const dados = req.body
    const novoCaixa = await caixaModels.iniciarNovoCaixa(dados)
    return res.status(201).json(novoCaixa)
}

const buscarCaixas = async (req, res) => {
  try {
    const caixas = await caixaModels.buscarCaixas();
    return res.status(201).json(caixas.reverse());
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    return res.status(500).json({ erro: "Erro ao listar caixas" });
  }
};

const buscarCaixasAbertos = async (req , res) => {
  const caixaAberto = await caixaModels.buscarCaixasAbertos()
  return res.status(201).json(caixaAberto)
}

const adicionarMovimentações = async (req, res) => {
    const {id} = req.params
    const dados = req.body
    const movimentacoes = await caixaModels.adicionarMovimentações(id , dados)
    return res.status(201).json(movimentacoes);
}

const buscarMovimentações = async (req , res) => {
    const {id} = req.params
    const movimentacoes = await caixaModels.buscarMovimentações(id)
    return res.status(201).json(movimentacoes)
}

const fecharCaixa = async (req , res) => {
  const {id} = req.params
  const dados = req.body
  const fecharCaixa = await caixaModels.fecharCaixa(id , dados)
  return res.status(201).json(fecharCaixa)
}

module.exports = {
  buscarCaixas,
  buscarCaixasAbertos,
  adicionarMovimentações,
  iniciarNovoCaixa,
  buscarMovimentações,
  fecharCaixa
};
