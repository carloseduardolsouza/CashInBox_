const funcionarioModels = require('../models/funcionarioModels');

const procurarFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const funcionario = await funcionarioModels.listarFuncionario(id);

    if (!funcionario) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    return res.status(200).json(funcionario);
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    return res.status(500).json({ error: "Erro interno ao buscar funcionário" });
  }
};

const novoFuncionario = async (req, res) => {
  try {
    const funcionarioId = await funcionarioModels.novoFuncionario(req.body);
    return res.status(201).json({ id: funcionarioId });
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);

    // Se erro customizado com código 400, retorna bad request, senão 500
    const statusCode = error.code === 400 ? 400 : 500;
    const message = error.message || "Erro interno no servidor.";

    return res.status(statusCode).json({ error: message });
  }
};

const deletarFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await funcionarioModels.deletarFuncionario(id);

    if (!resultado) {
      return res.status(404).json({ error: "Funcionário não encontrado para deletar" });
    }

    return res.status(200).json({ message: "Funcionário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar funcionário:", error);
    return res.status(500).json({ error: "Erro interno ao deletar funcionário" });
  }
};

const editarFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await funcionarioModels.editarFuncionario(id, req.body);

    if (!resultado) {
      return res.status(404).json({ error: "Funcionário não encontrado para editar" });
    }

    return res.status(200).json({ message: "Funcionário atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao editar funcionário:", error);
    return res.status(500).json({ error: "Erro interno ao editar funcionário" });
  }
};

const procurarFuncionarioId = async (req, res) => {
  try {
    const { id } = req.params;
    const funcionario = await funcionarioModels.procurarFuncionarioId(id);

    if (!funcionario) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    return res.status(200).json(funcionario);
  } catch (error) {
    console.error("Erro ao buscar funcionário pelo ID:", error);
    return res.status(500).json({ error: "Erro interno ao buscar funcionário" });
  }
};

module.exports = {
  novoFuncionario,
  procurarFuncionario,
  procurarFuncionarioId,
  deletarFuncionario,
  editarFuncionario,
};
