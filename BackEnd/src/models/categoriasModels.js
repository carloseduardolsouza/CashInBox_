const connection = require("./db");

const novaCategoria = async (dados) => {
  const { nome } = dados;

  const query = `
    INSERT INTO categorias (nome)
    VALUES (?)
  `;

  const values = [nome];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID); // ID da categoria recém-inserida
      }
    });
  });
};

const listarCategorias = () => {
  const query = `SELECT * FROM categorias`;

  return new Promise((resolve, reject) => {
    connection.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const buscarCategoriaPorId = (id) => {
  const query = `SELECT * FROM categorias WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const editarCategoria = async (id, dados) => {
  const { nome } = dados;

  const query = `
    UPDATE categorias
    SET nome = ?
    WHERE id = ?
  `;

  const values = [nome, id];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};

const deletarCategoria = (id) => {
  const query = `DELETE FROM categorias WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.run(query, [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};

module.exports = {
  novaCategoria,
  listarCategorias,
  buscarCategoriaPorId,
  editarCategoria,
  deletarCategoria,
};
