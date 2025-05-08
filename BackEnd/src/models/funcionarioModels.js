const connection = require("./db");

const listarFuncionario = async () => {
  const query = `SELECT * FROM funcionarios`;

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

  // Retorna os usuários (ou funcionarios) invertidos
  return users.reverse();
};

const novoFuncionario = async (dados) => {
  const {
    nome,
    cpf,
    telefone,
    email,
    data_admissao,
    salario_base,
    tipo_comissao,
    valor_comissao,
    status,
  } = dados;

  const created_at = new Date().toISOString();

  const query = `
      INSERT INTO funcionarios 
      (nome, cpf, telefone, email, data_admissao, salario_base, tipo_comissao, valor_comissao, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const values = [
    nome,
    cpf,
    telefone,
    email,
    data_admissao,
    salario_base,
    tipo_comissao,
    valor_comissao,
    status || "ativo",
    created_at,
  ];

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

const deletarFuncionario = async (id) => {
  const query = `DELETE FROM funcionarios WHERE id = ${id}`;

  await new Promise((resolve, reject) => {
    connection.run(query, function (err) {
      if (err) {
        reject(err); // Caso ocorra algum erro
      } else {
        resolve(this.lastID); // Retorna o ID do funcionario inserido
      }
    });
  });
};

const editarFuncionario = async (id, dados) => {
  const {
    nome,
    cpf,
    telefone,
    email,
    data_admissao,
    salario_base,
    tipo_comissao,
    valor_comissao,
    status,
  } = dados;

  const updated_at = new Date().toISOString();

  const query = `
    UPDATE funcionarios
    SET nome = ?, cpf = ?, telefone = ?, email = ?, data_admissao = ?, salario_base = ?, 
        tipo_comissao = ?, valor_comissao = ?, status = ?, updated_at = ?
    WHERE id = ?
  `;

  const values = [
    nome,
    cpf,
    telefone,
    email,
    data_admissao,
    salario_base,
    tipo_comissao,
    valor_comissao,
    status || "ativo",
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
        resolve(this.changes); // Retorna o número de linhas alteradas
      }
    });
  });
};


const procurarFuncionarioId = async (id) => {
  const query = `SELECT * FROM funcionarios WHERE id = ${id}`;

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

  // Retorna os usuários (ou Funcionarios) invertidos
  return users;
};

module.exports = {
  novoFuncionario,
  listarFuncionario,
  procurarFuncionarioId,
  deletarFuncionario,
  editarFuncionario,
};
