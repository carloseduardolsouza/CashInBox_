const connection = require("./db");

// Listar produtos com filtro opcional
const listarProdutos = async (p) => {
  const query =
    p === "all"
      ? `SELECT *, (estoque_atual <= estoque_minimo) AS estoque_min_atingido FROM produtos ORDER BY nome COLLATE NOCASE ASC`
      : `SELECT *, (estoque_atual <= estoque_minimo) AS estoque_min_atingido FROM produtos WHERE nome LIKE ? ORDER BY nome COLLATE NOCASE ASC`;

  const values = p === "all" ? [] : [`%${p}%`];

  const produtos = await new Promise((resolve, reject) => {
    connection.all(query, values, (err, rows) => {
      if (err) reject(err);
      else {
        // Garantir que vem como booleano (SQLite retorna 0 ou 1)
        const produtosFormatados = rows.map((produto) => ({
          ...produto,
          estoque_min_atingido: !!produto.estoque_min_atingido, // converte 0/1 pra true/false
        }));
        resolve(produtosFormatados);
      }
    });
  });

  return produtos;
};

// Criar novo produto e variações (se houver)
const novoProduto = async (dados) => {
  const {
    nome,
    descricao,
    codigo_barras,
    referencia,
    preco_venda,
    preco_custo = 0,
    estoque_atual = 0,
    estoque_minimo = 0,
    markup = 0,
    categoria,
    categoria_id,
    unidade_medida,
    ativo = true,
    imagens = [],
  } = dados;

  const timestamp = new Date().toISOString();

  const query = `
    INSERT INTO produtos 
    (nome, descricao, referencia, codigo_barras, preco_venda, preco_custo, estoque_atual, estoque_minimo, markup, categoria, categoria_id, unidade_medida, ativo, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nome,
    descricao,
    referencia,
    codigo_barras,
    preco_venda,
    preco_custo,
    estoque_atual,
    estoque_minimo,
    markup,
    categoria,
    categoria_id,
    unidade_medida,
    ativo ? 1 : 0,
    timestamp,
    timestamp,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, async function (err) {
      if (err) return reject(err);

      const produtoId = this.lastID;

      // Inserir imagens (variações)
      for (const imagem of imagens) {
        const { cor = null, tamanho = null, imagem_path } = imagem;
        await new Promise((res, rej) => {
          const insertQuery = `
            INSERT INTO variacoes (produto_id, cor, tamanho, imagem_path)
            VALUES (?, ?, ?, ?)
          `;
          connection.run(
            insertQuery,
            [produtoId, cor, tamanho, imagem_path],
            (err) => (err ? rej(err) : res())
          );
        });
      }

      resolve(produtoId);
    });
  });
};

// Editar produto
const editarProduto = async (id, dados) => {
  const {
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo = 0,
    estoque_atual = 0,
    estoque_minimo = 0,
    markup = 0,
    categoria,
    categoria_id,
    unidade_medida,
    ativo,
  } = dados;

  const updated_at = new Date().toISOString();

  const query = `
    UPDATE produtos SET 
      nome = ?, descricao = ?, codigo_barras = ?, preco_venda = ?, preco_custo = ?, estoque_atual = ?, estoque_minimo = ?, markup = ?, categoria = ?, categoria_id = ?, unidade_medida = ?, ativo = ?, updated_at = ?
    WHERE id = ?
  `;

  const values = [
    nome,
    descricao,
    codigo_barras,
    preco_venda,
    preco_custo,
    estoque_atual,
    estoque_minimo,
    markup,
    categoria,
    categoria_id,
    unidade_medida,
    ativo ? 1 : 0,
    updated_at,
    id,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) return reject(err);
      resolve(this.changes === 0 ? null : this.changes);
    });
  });
};

// Deletar produto e variações associadas
const deletarProduto = async (id) => {
  // Deleta variações primeiro
  await new Promise((resolve, reject) => {
    connection.run(`DELETE FROM variacoes WHERE produto_id = ?`, [id], (err) =>
      err ? reject(err) : resolve()
    );
  });

  // Deleta produto
  return new Promise((resolve, reject) => {
    connection.run(`DELETE FROM produtos WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      // Para deletar: SQLite não retorna lastID, então check this.changes
      resolve(this.changes === 0 ? null : true);
    });
  });
};

// Buscar produto por ID
const procurarProdutoId = async (id) => {
  const query = `SELECT * FROM produtos WHERE id = ?`;

  const produto = await new Promise((resolve, reject) => {
    connection.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  return produto;
};

// Criar variação
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
        else resolve(this.lastID);
      }
    );
  });
};

// Buscar variações por produto
const getVariacoesPorProduto = async (produto_id) => {
  const query = `SELECT * FROM variacoes WHERE produto_id = ?`;

  return new Promise((resolve, reject) => {
    connection.all(query, [produto_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Deletar variações por produto
const deletarVVariacoesDoProduto = async (produto_id) => {
  const query = `DELETE FROM variacoes WHERE produto_id = ?`;

  return new Promise((resolve, reject) => {
    connection.run(query, [produto_id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
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
