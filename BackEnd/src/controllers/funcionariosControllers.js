const funcionarioModels = require('../models/funcionarioModels')

const procurarFuncionario = async (req, res) => {
    const funcionario = await funcionarioModels.listarFuncionario()
    return res.status(200).json(funcionario)
}

const novoFuncionario = async (req , res) => {
    const funcionario = await funcionarioModels.novoFuncionario(req.body)
    return res.status(201).json(funcionario)
}

const deletarFuncionario = async (req , res) => {
    const {id} = req.params
    const deletarFuncionario = await funcionarioModels.deletarFuncionario(id)
    return res.status(200).json(deletarFuncionario)
}

const editarFuncionario = async (req , res) => {
    const {id} = req.params
    const editarFuncionario = await funcionarioModels.editarFuncionario(id , req.body)
    return res.status(200).json()
}

const procurarFuncionarioId = async (req, res) => {
    const {id} = req.params
    const funcionario = await funcionarioModels.procurarFuncionarioId(id)
    return res.status(200).json(funcionario)
}

module.exports = {
    novoFuncionario,
    procurarFuncionario,
    procurarFuncionarioId,
    deletarFuncionario,
    editarFuncionario
}