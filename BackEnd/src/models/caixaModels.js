const connection = require("./db");

const iniciarNovoCaixa = async (dados) => {
  const { valor_abertura } = dados;

  const created_at = new Date().toISOString();

  const query = `
    INSERT INTO caixas (data_abertura , valor_abertura , status)
    VALUES (? , ? , ?)
  `;

  const values = [created_at, valor_abertura, "aberto"];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

const buscarCaixas = async () => {
  const query = `SELECT * FROM caixas`;

  return new Promise((resolve, reject) => {
    connection.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const adicionarMovimentações = async (id, dados) => {
  const { descricao, tipo, valor } = dados;

  const created_at = new Date().toISOString();

  const query = `
    INSERT INTO movimentacoes (caixa_id , data , descricao , tipo , valor)
    VALUES (? , ? , ? , ? , ?)
  `;

  const values = [id, created_at, descricao, tipo, valor];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

const buscarMovimentações = async (id) => {
  const query = `SELECT * FROM movimentacoes WHERE caixa_id = ${id}`;

  return new Promise((resolve, reject) => {
    connection.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    }); 
  });
};

module.exports = {
  buscarCaixas,
  adicionarMovimentações,
  iniciarNovoCaixa,
  buscarMovimentações,
};
