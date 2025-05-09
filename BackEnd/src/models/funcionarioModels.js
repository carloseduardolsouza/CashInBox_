const connection = require("./db");

const listarFuncionario = async (p) => {
  let query;
  let values = [];

  if (p === "all") {
    query = `SELECT * FROM funcionarios`;
  } else {
    query = `SELECT * FROM funcionarios WHERE nome LIKE ?`;
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

const novoFuncionario = async (dados) => {
  const {
    nome,
    cpf,
    telefone,
    email,
    salario_base,
    data_nascimento,
    genero,
    funcao,
    endereco,
    tipo_comissao,
    valor_comissao,
    regime_contrato,
    status = "ativo",
  } = dados;

  const data_admissao = new Date().toISOString(); 
  const created_at = new Date().toISOString();

  // garante que o status esteja no formato correto
  const statusFormatado =
    status.toLowerCase() === "inativo" ? "inativo" : "ativo";

  const query = `
    INSERT INTO funcionarios 
    (nome, cpf, telefone, email, salario_base, data_nascimento, genero, funcao, endereco, tipo_comissao, valor_comissao, regime_contrato, status, data_admissao, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nome,
    cpf,
    telefone,
    email,
    salario_base,
    data_nascimento,
    genero,
    funcao,
    endereco,
    tipo_comissao,
    valor_comissao,
    regime_contrato,
    statusFormatado,
    data_admissao,
    created_at,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          return reject({
            code: 400,
            message:
              "Erro de restrição: verifique CPF duplicado ou campos inválidos.",
          });
        }
        return reject(err);
      }
      resolve(this.lastID);
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
