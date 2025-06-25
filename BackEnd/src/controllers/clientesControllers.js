const clientesModels = require("../models/clientesModels");

/**
 * 🔍 Busca um cliente pelo ID
 */
const procurarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await clientesModels.listarCliente(id);
    return res.status(200).json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return res.status(500).json({ erro: "Erro ao buscar cliente" });
  }
};

/**
 * 🆕 Cria um novo cliente com os dados enviados no corpo da requisição
 */
const novoCliente = async (req, res) => {
  try {
    const novo = await clientesModels.novoCliente(req.body);
    return res.status(201).json(novo);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return res.status(500).json({ erro: "Erro ao criar cliente" });
  }
};

/**
 * 🗑️ Deleta um cliente pelo ID
 */
const deletarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await clientesModels.deletarCliente(id);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return res.status(500).json({ erro: "Erro ao deletar cliente" });
  }
};

/**
 * ✏️ Edita um cliente com base no ID e dados enviados
 */
const editarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await clientesModels.editarCliente(id, req.body);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao editar cliente:", error);
    return res.status(500).json({ erro: "Erro ao editar cliente" });
  }
};

/**
 * 🔎 Busca cliente por ID de forma específica (caso tenha função diferente da listarCliente)
 */
const procurarClienteId = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await clientesModels.procurarClienteId(id);
    return res.status(200).json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente por ID:", error);
    return res.status(500).json({ erro: "Erro ao buscar cliente por ID" });
  }
};

// Exporta todas as funções para uso nas rotas
module.exports = {
  novoCliente,
  procurarCliente,
  procurarClienteId,
  deletarCliente,
  editarCliente,
};
