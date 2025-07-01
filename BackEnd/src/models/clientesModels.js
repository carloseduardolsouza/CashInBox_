const connection = require("./db");

/**
 * 🔍 Lista todos os clientes ou filtra por nome usando LIKE
 * @param {string} p - "all" para todos ou parte do nome para buscar
 */
const listarCliente = async (p) => {
  let query;
  let values = [];

  if (p === "all") {
    query = `SELECT * FROM clientes ORDER BY nome COLLATE NOCASE ASC`;
  } else {
    query = `SELECT * FROM clientes WHERE nome LIKE ? COLLATE NOCASE ORDER BY nome ASC`;
    values.push(`%${p}%`); // Protege contra SQL injection
  }

  return new Promise((resolve, reject) => {
    connection.all(query, values, (err, rows) => {
      if (err) return reject(err);
      resolve(rows); // Retorna os mais recentes no topo
    });
  });
};

/**
 * 🆕 Cria um novo cliente no banco de dados
 */
const novoCliente = async (dados) => {
  const { nome, cpf_cnpj, email, telefone, data_nascimento, endereco, genero } =
    dados;

  const created_at = new Date().toISOString();

  const query = `
    INSERT INTO clientes 
    (nome, cpf_cnpj, email, genero, telefone, data_nascimento, endereco, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
      if (err) return reject(err);
      resolve(this.lastID); // ID do novo cliente
    });
  });
};

/**
 * 🗑️ Deleta um cliente com base no ID
 */
const deletarCliente = async (id) => {
  const query = `DELETE FROM clientes WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.run(query, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes); // Número de registros deletados
    });
  });
};

/**
 * ✏️ Edita os dados de um cliente existente
 */
const editarCliente = async (id, dados) => {
  const { nome, cpf_cnpj, email, genero, telefone, data_nascimento, endereco } =
    dados;

  const updatedAt = new Date().toISOString();

  const query = `
    UPDATE clientes
    SET nome = ?, cpf_cnpj = ?, email = ?, genero = ?, 
        telefone = ?, data_nascimento = ?, endereco = ?, updated_at = ?
    WHERE id = ?
  `;

  const values = [
    nome,
    cpf_cnpj,
    email,
    genero,
    telefone,
    data_nascimento,
    endereco,
    updatedAt,
    id,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) return reject(err);
      if (this.changes === 0) return resolve(null); // Nenhuma linha atualizada
      resolve(this.changes); // Quantas linhas foram alteradas
    });
  });
};

/**
 * 🔎 Busca um cliente específico pelo ID
 */
const procurarClienteId = async (id) => {
  const query = `SELECT * FROM clientes WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.all(query, [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows); // Pode retornar [] se não encontrar
    });
  });
};

module.exports = {
  novoCliente,
  listarCliente,
  procurarClienteId,
  deletarCliente,
  editarCliente,
};
