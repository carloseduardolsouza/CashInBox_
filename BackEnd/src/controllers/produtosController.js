const produtosModels = require("../models/produtosModels");
const variacaoProdutoModels = require("../models/variacaoProdutoModels"); // Correção da importação
const services = require("../services/services");
const fs = require("fs");
const path = require("path");

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
    // Parse dos dados JSON vindos do formData
    const dados = JSON.parse(req.body.dados);

    // Criação do produto principal no banco de dados
    const produto = await produtosModels.novoProduto(dados);

    if (!produto) {
      return res.status(400).json({ erro: "Não foi possível criar o produto" });
    }

    // Inicializa listas de variações e imagens simples
    const arquivos = req.files || [];
    const variacoes = [];
    const imagensSimples = [];

    // Assumindo que os arquivos vêm na mesma ordem que dados.imagens
    arquivos.map(async (image) => {
      await variacaoProdutoModels.criarVariacao(image, produto);
    });

    return res.status(201).json({
      sucesso: true,
      produto,
      variacoes,
      imagensSimples,
    });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    return res.status(500).json({ erro: "Erro ao criar produto" });
  }
};

const novaImagemProduto = async (req, res) => {
  const { id } = req.params;

  const arquivos = req.files || [];

  // Assumindo que os arquivos vêm na mesma ordem que dados.imagens
  arquivos.map(async (image) => {
    await variacaoProdutoModels.criarVariacao(image, id);
  });

  return res.status(201).json({
    sucesso: true,
  });
};

// Função para editar um produto
const editarProduto = async (req, res) => {
  const { id } = req.params;
  try {
    await produtosModels.editarProduto(id, req.body);
    return res.status(200).json({ message: "Produto editado com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao editar produto" });
  }
};

// Função para deletar um produto e as imagens associadas
const deletarProduto = async (req, res) => {
  const { id } = req.params;
  try {
    // Busca as variações do produto para deletar as imagens
    const variacoes = await produtosModels.getVariacoesPorProduto(id);

    // Deleta as imagens do servidor
    variacoes.map((arquivo) => {
      console.log(arquivo.imagem_path);
      services.deletarImagem(arquivo.imagem_path);
    });

    // Deleta as variações e o produto
    await produtosModels.deletarVVariacoesDoProduto(id);
    await produtosModels.deletarProduto(id);

    return res
      .status(200)
      .json({ message: "Produto e imagens excluídos com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao deletar produto" });
  }
};

// Função para procurar um produto pelo id
const procurarProdutoId = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await produtosModels.procurarProdutoId(id);
    return res.status(200).json(produto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar produto" });
  }
};

const procurarVariaçãoProdutos = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await variacaoProdutoModels.listarVariacoesPorProduto(id);
    return res.status(200).json(produto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar produto" });
  }
};

const deletarVariacaoProdutos = async (req, res) => {
  try {
    const { id } = req.params;
    const variacoes = await variacaoProdutoModels.listarVariacoesPorProdutoId(
      id
    );
    variacoes.map((arquivo) => {
      console.log(arquivo.imagem_path);
      services.deletarImagem(arquivo.imagem_path);
    });

    const resultado = await variacaoProdutoModels.deletarVariacao(id);

    if (resultado.affectedRows === 0) {
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

  procurarVariaçãoProdutos,
  deletarVariacaoProdutos,
};
