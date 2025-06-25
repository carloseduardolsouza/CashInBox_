const connection = require("./db");

const novaCategoria = async ({ nome }) => {
  if (!nome || !nome.trim()) {
    throw new Error("Nome da categoria é obrigatório");
  }

  const query = `INSERT INTO categorias (nome) VALUES (?)`;
  const values = [nome.trim()];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

const listarCategorias = () => {
  const query = `SELECT * FROM categorias ORDER BY nome ASC`;
  return new Promise((resolve, reject) => {
    connection.all(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const buscarCategoriaPorId = (id) => {
  if (!id) return Promise.reject(new Error("ID da categoria é obrigatório"));

  const query = `SELECT * FROM categorias WHERE id = ? LIMIT 1`;
  return new Promise((resolve, reject) => {
    connection.get(query, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
};

const editarCategoria = async (id, { nome }) => {
  if (!id) throw new Error("ID da categoria é obrigatório");
  if (!nome || !nome.trim()) throw new Error("Nome da categoria é obrigatório");

  const query = `UPDATE categorias SET nome = ? WHERE id = ?`;
  const values = [nome.trim(), id];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
};

const deletarCategoria = (id) => {
  if (!id) return Promise.reject(new Error("ID da categoria é obrigatório"));

  const query = `DELETE FROM categorias WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.run(query, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
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
