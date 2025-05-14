const connection = require("./db"); // Certifique-se de que o arquivo db.js está configurado corretamente

// Criar uma nova variação para um produto
const criarVariacao = async (dados , produto_id) => {
  const {
    filename,
  } = dados 

  const query = `
    INSERT INTO variacoes (produto_id,imagem_path)
    VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    connection.run(query, [produto_id, filename], function (err) {
      if (err) reject(err);
      else resolve(this.lastID); // Retorna o ID da variação criada
    });
  });
};

// Listar todas as variações de um produto
const listarVariacoesPorProduto = async (produto_id) => {
  const query = `SELECT * FROM variacoes WHERE produto_id = ?`;

  return new Promise((resolve, reject) => {
    connection.all(query, [produto_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Editar uma variação de um produto
const editarVariacao = async (id, { cor, tamanho, imagem_path }) => {
  const query = `
    UPDATE variacoes
    SET cor = ?, tamanho = ?, imagem_path = ?
    WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    connection.run(query, [cor, tamanho, imagem_path, id], function (err) {
      if (err) reject(err);
      else resolve(this.changes); // Retorna o número de variações alteradas
    });
  });
};

// Deletar uma variação de produto
const deletarVariacao = async (id) => {
  const query = `DELETE FROM variacoes WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.run(query, [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes); // Número de variações deletadas
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

const listarVariacoesPorProdutoId = async (id) => {
  const query = `SELECT * FROM variacoes WHERE id = ?`

  return new Promise((resolve, reject) => {
    connection.all(query, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  criarVariacao,
  listarVariacoesPorProduto,
  editarVariacao,
  deletarVariacao,
  deletarVVariacoesDoProduto,
  listarVariacoesPorProdutoId
};
