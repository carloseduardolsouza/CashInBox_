const categoriasModels = require('../models/categoriasModels');

const novaCategoria = async (req, res) => {
  try {
    const categoriaId = await categoriasModels.novaCategoria(req.body);
    return res.status(201).json({ id: categoriaId, ...req.body });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return res.status(500).json({ erro: "Erro ao criar categoria" });
  }
};

const listarCategorias = async (_, res) => {
  try {
    const categorias = await categoriasModels.listarCategorias();
    return res.status(200).json(categorias);
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    return res.status(500).json({ erro: "Erro ao listar categorias" });
  }
};

const buscarCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await categoriasModels.buscarCategoriaPorId(id);

    if (!categoria) return res.status(404).json({ erro: "Categoria não encontrada" });

    return res.status(200).json(categoria);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return res.status(500).json({ erro: "Erro ao buscar categoria" });
  }
};

const editarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const atualizada = await categoriasModels.editarCategoria(id, req.body);

    if (!atualizada) return res.status(404).json({ erro: "Categoria não encontrada para edição" });

    return res.status(200).json({ id, ...req.body });
  } catch (error) {
    console.error("Erro ao editar categoria:", error);
    return res.status(500).json({ erro: "Erro ao editar categoria" });
  }
};

const deletarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const deletada = await categoriasModels.deletarCategoria(id);

    if (!deletada) return res.status(404).json({ erro: "Categoria não encontrada para exclusão" });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return res.status(500).json({ erro: "Erro ao deletar categoria" });
  }
};

module.exports = {
  novaCategoria,
  listarCategorias,
  buscarCategoriaPorId,
  editarCategoria,
  deletarCategoria,
};
