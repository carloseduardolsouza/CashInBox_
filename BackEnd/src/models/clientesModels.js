const connection = require("./db");

const listarCliente = async (p) => {
  let query;
  let values = [];

  if (p === "all") {
    query = `SELECT * FROM clientes`;
  } else {
    query = `SELECT * FROM clientes WHERE nome LIKE ?`;
    values.push(`%${p}%`); // Isso garante aspas e evita SQL injection
  }

  const users = await new Promise((resolve, reject) => {
    connection.all(query, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  return users.reverse();
};


const novoCliente = async (dados) => {
  const { nome, cpf_cnpj, email, telefone, data_nascimento, endereco , genero } = dados;

  const created_at = new Date().toISOString();

  const query = `
      INSERT INTO clientes 
      (nome, cpf_cnpj, email, genero , telefone, data_nascimento, endereco, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ? , ?)
    `;

  const values = [
    nome,
    cpf_cnpj,
    email,
    genero,
    telefone,
    data_nascimento,
    endereco,
    created_at,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID); // ID do cliente recém-inserido
      }
    });
  });
};

const deletarCliente = async (id) => {
  const query = `DELETE FROM clientes WHERE id = ${id}`;

  await new Promise((resolve, reject) => {
    connection.run(query, function (err) {
      if (err) {
        reject(err); // Caso ocorra algum erro
      } else {
        resolve(this.lastID); // Retorna o ID do cliente inserido
      }
    });
  });
};

const editarCliente = async (id, dados) => {
  const { nome, cpf_cnpj, email, genero , telefone, data_nascimento, endereco } = dados;

  const query = `
      UPDATE clientes
      SET nome = ?, cpf_cnpj = ?, email = ?, genero = ? , telefone = ?, data_nascimento = ?, endereco = ?, updated_at = ?
      WHERE id = ?
    `;

  const updatedAt = new Date().toISOString();

  return new Promise((resolve, reject) => {
    connection.run(
      query,
      [
        nome,
        cpf_cnpj,
        email,
        genero,
        telefone,
        data_nascimento,
        endereco,
        updatedAt,
        id,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null); // Nenhuma linha foi atualizada (ID pode não existir)
        } else {
          resolve(this.changes); // Quantidade de linhas alteradas
        }
      }
    );
  });
};

const procurarClienteId = async (id) => {
  const query = `SELECT * FROM clientes WHERE id = ${id}`;

  // Use o método `all` para retornar todos os resultados da consulta
  const users = await new Promise((resolve, reject) => {
    connection.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  // Retorna os usuários (ou clientes) invertidos
  return users;
};

module.exports = {
  novoCliente,
  listarCliente,
  procurarClienteId,
  deletarCliente,
  editarCliente,
};
