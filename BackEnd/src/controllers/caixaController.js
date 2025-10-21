const caixaModels = require("../models/caixaModels");

/**
 * Inicia um novo caixa com os dados enviados no corpo da requisição
 */
const iniciarNovoCaixa = async (req, res) => {
  try {
    const dados = req.body;
    const novoCaixa = await caixaModels.iniciarNovoCaixa(dados);
    return res.status(201).json(novoCaixa);
  } catch (error) {
    console.error("Erro ao iniciar novo caixa:", error);
    return res.status(500).json({ erro: "Erro ao iniciar novo caixa" });
  }
};

/**
 * Retorna todos os caixas existentes, em ordem decrescente (mais recente primeiro)
 */
const buscarCaixas = async (req, res) => {
  try {
    const caixas = await caixaModels.buscarCaixas();
    return res.status(200).json(caixas.reverse());
  } catch (error) {
    console.error("Erro ao buscar caixas:", error);
    return res.status(500).json({ erro: "Erro ao buscar caixas" });
  }
};

/**
 * Retorna apenas os caixas que estão abertos
 * Caso não seja passado o `res`, retorna os dados para uso interno
 */
const buscarCaixasAbertos = async (req, res) => {
  try {
    const caixaAberto = await caixaModels.buscarCaixasAbertos();
    if (!res) return caixaAberto;
    return res.status(200).json(caixaAberto);
  } catch (error) {
    console.error("Erro ao buscar caixas abertos:", error);
    return res.status(500).json({ erro: "Erro ao buscar caixas abertos" });
  }
};

/**
 * Handler auxiliar para adicionar movimentações em um caixa (pode ser usado internamente)
 */
const adicionarMovimentacaoHandler = async (dados) => {
  return await caixaModels.adicionarMovimentacoes(dados);
};

/**
 * Adiciona movimentações em um caixa específico (via API)
 */
const adicionarMovimentacoes = async (req, res) => {
  try {
    const dados = req.body;
    const movimentacoes = await adicionarMovimentacaoHandler(dados);
    return res.status(201).json(movimentacoes);
  } catch (error) {
    console.error("Erro ao adicionar movimentações:", error);
    return res.status(500).json({ erro: "Erro ao adicionar movimentações" });
  }
};

/**
 * Busca as movimentações de um caixa específico
 */
const buscarMovimentacoes = async (req, res) => {
  try {
    const { id } = req.params;
    const movimentacoes = await caixaModels.buscarMovimentacoes(id);
    return res.status(200).json(movimentacoes);
  } catch (error) {
    console.error("Erro ao buscar movimentações:", error);
    return res.status(500).json({ erro: "Erro ao buscar movimentações" });
  }
};

/**
 * Fecha um caixa específico, atualizando com os dados recebidos
 */
const fecharCaixa = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;
    const resultado = await caixaModels.fecharCaixa(id, dados);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao fechar caixa:", error);
    return res.status(500).json({ erro: "Erro ao fechar caixa" });
  }
};

// Exporta todas as funções para uso nas rotas
module.exports = {
  buscarCaixas,
  buscarCaixasAbertos,
  adicionarMovimentacoes,
  adicionarMovimentacaoHandler,
  iniciarNovoCaixa,
  buscarMovimentacoes,
  fecharCaixa,
};
