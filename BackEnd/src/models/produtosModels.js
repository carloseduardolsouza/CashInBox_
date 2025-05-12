const connection = require("./db");

// Listar todos os produtos
const listarProdutos = async (p) => {
  let query;
  let values = [];

  if (p === "all") {
    query = `SELECT * FROM produtos`;
  } else {
    query = `SELECT * FROM produtos WHERE nome LIKE ?`;
    values.push(`%${p}%`); // Isso garante aspas e evita SQL injection
  }

  const produtos = await new Promise((resolve, reject) => {
    connection.all(query, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  return produtos.reverse(); // Retorna os produtos invertidos
};

// Criar um novo produto
const novoProduto = async (dados) => {
  const {
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo,
    estoque_atual,
    estoque_minimo,
    markup,
    categoria,
    marca,
    unidade_medida,
    ativo,
    imagens, // Adicionando a propriedade de imagens
  } = dados;

  const created_at = new Date().toISOString();
  const updated_at = created_at;

  const query = `
    INSERT INTO produtos 
    (nome, descricao, codigo_barras, preco_venda, preco_custo, estoque_atual, estoque_minimo, markup, categoria, marca, unidade_medida, ativo, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo || 0,
    estoque_atual || 0,
    estoque_minimo || 0,
    markup || 0,
    categoria,
    marca,
    unidade_medida,
    ativo === false ? 0 : 1,
    created_at,
    updated_at,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        const produtoId = this.lastID; // ID do produto recém-criado

        // Agora inserimos as imagens (simples ou com variações)
        if (imagens && imagens.length > 0) {
          const insertImagensQuery = `
            INSERT INTO variacoes (produto_id, cor, tamanho, imagem_path)
            VALUES (?, ?, ?, ?)
          `;

          imagens.forEach((imagem) => {
            if (imagem.cor && imagem.tamanho) {
              connection.run(
                insertImagensQuery,
                [produtoId, imagem.cor, imagem.tamanho, imagem.imagem_path],
                (err) => {
                  if (err) reject(err);
                }
              );
            } else {
              // Caso não haja variação, salvamos apenas a imagem
              connection.run(
                insertImagensQuery,
                [produtoId, null, null, imagem.imagem_path],
                (err) => {
                  if (err) reject(err);
                }
              );
            }
          });
        }

        resolve(produtoId); // Retorna o ID do produto
      }
    });
  });
};

// Editar um produto
const editarProduto = async (id, dados) => {
  const {
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo,
    estoque_atual,
    estoque_minimo,
    markup,
    categoria,
    marca,
    unidade_medida,
    ativo,
    imagens, // Imagens a serem alteradas
  } = dados;

  const updated_at = new Date().toISOString();

  const query = `
    UPDATE produtos
    SET 
      nome = ?, 
      descricao = ?, 
      codigo_barras = ?, 
      preco_venda = ?, 
      preco_custo = ?, 
      estoque_atual = ?, 
      estoque_minimo = ?, 
      markup = ?, 
      categoria = ?, 
      marca = ?, 
      unidade_medida = ?, 
      ativo = ?, 
      updated_at = ?
    WHERE id = ?
  `;

  const values = [
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo || 0,
    estoque_atual || 0,
    estoque_minimo || 0,
    markup || 0,
    categoria,
    marca,
    unidade_medida,
    ativo === false ? 0 : 1,
    updated_at,
    id,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else if (this.changes === 0) {
        resolve(null); // Nenhuma linha foi alterada
      } else {
        // Atualizando as imagens do produto
        if (imagens && imagens.length > 0) {
          const deleteImagesQuery = `DELETE FROM variacoes WHERE produto_id = ?`;
          connection.run(deleteImagesQuery, [id], (err) => {
            if (err) reject(err);

            // Inserindo as novas imagens
            const insertImagensQuery = `
              INSERT INTO variacoes (produto_id, cor, tamanho, imagem_path)
              VALUES (?, ?, ?, ?)
            `;
            imagens.forEach((imagem) => {
              if (imagem.cor && imagem.tamanho) {
                connection.run(
                  insertImagensQuery,
                  [id, imagem.cor, imagem.tamanho, imagem.imagem_path],
                  (err) => {
                    if (err) reject(err);
                  }
                );
              } else {
                // Caso não haja variação, salvamos apenas a imagem
                connection.run(
                  insertImagensQuery,
                  [id, null, null, imagem.imagem_path],
                  (err) => {
                    if (err) reject(err);
                  }
                );
              }
            });
          });
        }

        resolve(this.changes); // Retorna o número de linhas alteradas
      }
    });
  });
};

// Deletar um produto
const deletarProduto = async (id) => {
  // Primeiro, removemos as variações do produto
  const deleteImagesQuery = `DELETE FROM variacoes WHERE produto_id = ?`;
  await new Promise((resolve, reject) => {
    connection.run(deleteImagesQuery, [id], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });

  // Agora deletamos o produto
  const query = `DELETE FROM produtos WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.run(query, [id], function (err) {
      if (err) reject(err);
      else resolve(this.lastID); // ID do produto deletado
    });
  });
};

// Buscar produto por ID
const procurarProdutoId = async (id) => {
  const query = `SELECT * FROM produtos WHERE id = ?`;

  const produto = await new Promise((resolve, reject) => {
    connection.all(query, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  return produto;
};

// Criar uma nova variação para um produto
const criarVariacao = async ({ produto_id, cor, tamanho, imagem_path }) => {
  const query = `
    INSERT INTO variacoes (produto_id, cor, tamanho, imagem_path)
    VALUES (?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    connection.run(
      query,
      [produto_id, cor, tamanho, imagem_path],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID); // Retorna o ID da variação criada
      }
    );
  });
};

// Buscar variações de um produto por ID
const getVariacoesPorProduto = async (produto_id) => {
  const query = `SELECT * FROM variacoes WHERE produto_id = ?`;

  return new Promise((resolve, reject) => {
    connection.all(query, [produto_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Deletar todas as variações de um produto
const deletarVVariacoesDoProduto = async (produto_id) => {
  const query = `DELETE FROM variacoes WHERE produto_id = ?`;

  return new Promise((resolve, reject) => {
    connection.run(query, [produto_id], function (err) {
      if (err) reject(err);
      else resolve(this.changes); // Número de variações deletadas
    });
  });
};

module.exports = {
  listarProdutos,
  novoProduto,
  editarProduto,
  deletarProduto,
  procurarProdutoId,
  criarVariacao,
  getVariacoesPorProduto,
  deletarVVariacoesDoProduto,
};
