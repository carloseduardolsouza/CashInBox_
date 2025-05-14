const funcionarioModels = require('../models/funcionarioModels')

const procurarFuncionario = async (req, res) => {
    const {id} = req.params
    const funcionario = await funcionarioModels.listarFuncionario(id)
    return res.status(200).json(funcionario)
}

const novoFuncionario = async (req, res) => {
  try {
    const funcionario = await funcionarioModels.novoFuncionario(req.body);
    return res.status(201).json({ id: funcionario });
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);

    // Se o erro foi tratado como objeto customizado
    const statusCode = error.code === 400 ? 400 : 500;
    const message = error.message || "Erro interno no servidor.";

    return res.status(statusCode).json({ error: message });
  }
};


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