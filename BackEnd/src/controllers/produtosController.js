const produtosModels = require("../models/produtosModels");
const variacaoProdutoModels = require("../models/variacaoProdutoModels");
const services = require("../services/services");

// Função para listar os produtos
const procurarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produtos = await produtosModels.listarProdutos(id);
    return res.status(200).json(produtos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

const novoProduto = async (req, res) => {
  try {
    const dados = JSON.parse(req.body.dados);

    const produto = await produtosModels.novoProduto(dados);

    if (!produto) {
      return res.status(400).json({ erro: "Não foi possível criar o produto" });
    }

    const arquivos = req.files || [];

    // Use for...of pra garantir await funcionando direito
    for (const image of arquivos) {
      await variacaoProdutoModels.criarVariacao(image, produto);
    }

    return res.status(201).json({
      sucesso: true,
      produto,
    });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    return res.status(500).json({ erro: "Erro ao criar produto" });
  }
};

const novaImagemProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const arquivos = req.files || [];

    for (const image of arquivos) {
      await variacaoProdutoModels.criarVariacao(image, id);
    }

    return res.status(201).json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao adicionar imagem:", err);
    return res.status(500).json({ erro: "Erro ao adicionar imagem" });
  }
};

const editarProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const atualizado = await produtosModels.editarProduto(id, req.body);

    if (!atualizado) {
      return res.status(404).json({ error: "Produto não encontrado para edição" });
    }

    return res.status(200).json({ message: "Produto editado com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao editar produto" });
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const variacoes = await produtosModels.getVariacoesPorProduto(id);

    // Deletar as imagens associadas (garantindo await)
    for (const arquivo of variacoes) {
      await services.deletarImagem(arquivo.imagem_path);
    }

    await produtosModels.deletarVVariacoesDoProduto(id);
    const deletado = await produtosModels.deletarProduto(id);

    if (!deletado) {
      return res.status(404).json({ error: "Produto não encontrado para exclusão" });
    }

    return res.status(200).json({ message: "Produto e imagens excluídos com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao deletar produto" });
  }
};

const procurarProdutoId = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await produtosModels.procurarProdutoId(id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json(produto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar produto" });
  }
};

const procurarVariacoesProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const variacoes = await variacaoProdutoModels.listarVariacoesPorProduto(id);

    return res.status(200).json(variacoes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar variações" });
  }
};

const deletarVariacaoProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const variacoes = await variacaoProdutoModels.listarVariacoesPorProdutoId(id);

    for (const arquivo of variacoes) {
      await services.deletarImagem(arquivo.imagem_path);
    }

    const resultado = await variacaoProdutoModels.deletarVariacao(id);

    if (!resultado || resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Variação não encontrada" });
    }

    return res.status(200).json({ message: "Variação deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar variação:", err);
    return res.status(500).json({ error: "Erro ao deletar variação" });
  }
};

module.exports = {
  procurarProduto,
  novoProduto,
  novaImagemProduto,
  editarProduto,
  deletarProduto,
  procurarProdutoId,
  procurarVariacoesProduto,
  deletarVariacaoProduto,
};
