const vendaModels = require("../models/vendaModels")

const NovaVenda = async (req , res) => {
    const venda = await vendaModels.NovaVenda(req.body)
    return res.status(201).json(venda)
}

const listarVendas = async (req , res) => {
    const {filtro , pesquisa} = req.params
    const vendas = await vendaModels.listarVendas(filtro , pesquisa)
    return res.status(201).json(vendas)
}

const produrarVendaId = async (req , res) => {
    const {id} = req.params
    const vendas = await vendaModels.produrarVendaId(id)
    return res.status(201).json(vendas)
}

const procurarProdutosVenda = async (req , res) => {
    const {id} = req.params
    const produtos = await vendaModels.procurarProdutosVenda(id)
    return res.status(201).json(produtos)
}

const deletarVenda = async (req , res) => {
    const {id} = req.params
    const venda = await vendaModels.deletarVenda(id)
    return res.status(201)
}

module.exports = {
    NovaVenda,
    listarVendas,
    produrarVendaId,
    procurarProdutosVenda,
    deletarVenda
}