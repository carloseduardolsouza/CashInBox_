const produtosModels = require("../models/produtosModels");
const variacaoProdutoModels = require("../models/variacaoProdutoModels"); // Correção da importação
const fs = require("fs");
const path = require("path");

// Função para listar os produtos
const procurarProduto = async (req, res) => {
  try {
    const {id} = req.params
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

    // Verificação de imagens enviadas no campo req.files
    const imagensEnviadas = req.files || [];

    // Inicializa listas de variações e imagens simples
    const variacoes = [];
    const imagensSimples = [];

    // Garante que dados.imagens exista e seja um array antes de iterar
    if (Array.isArray(dados.imagens)) {
      dados.imagens.forEach((imagem, index) => {
        // Se imagem tiver 'cor' e 'tamanho', é uma variação
        if (imagem.cor && imagem.tamanho && imagem.imagem_path) {
          variacoes.push({
            produtoId: produto.id,
            variacao: `${imagem.cor} - ${imagem.tamanho}`,
            imagem: imagem.imagem_path,
          });
        } else if (typeof imagem === "string") {
          // Imagem simples (sem cor/tamanho)
          imagensSimples.push({
            produtoId: produto.id,
            variacao: `Imagem simples ${index + 1}`,
            imagem: imagem,
          });
        }
      });
    }

    // Salva as variações no banco
    for (const variacao of variacoes) {
      await variacaoProdutoModels.criarVariacao(variacao);
    }

    // Salva as imagens simples no banco
    for (const imagemSimples of imagensSimples) {
      await variacaoProdutoModels.criarVariacao(imagemSimples);
    }

    return res.status(201).json({ sucesso: true, produto, variacoes, imagensSimples });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    return res.status(500).json({ erro: "Erro ao criar produto" });
  }
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
    variacoes.forEach((v) => {
      if (v.imagem_path && fs.existsSync(v.imagem_path)) {
        fs.unlinkSync(v.imagem_path); // Remove a imagem
      }
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

module.exports = {
  procurarProduto,
  novoProduto,
  editarProduto,
  deletarProduto,
  procurarProdutoId,
};
