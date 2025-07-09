const connection = require("./db");

const listarFuncionario = async (p) => {
  let query;
  let values = [];

  if (p === "all") {
    query = `SELECT * FROM funcionarios`;
  } else {
    query = `SELECT * FROM funcionarios WHERE nome LIKE ?`;
    values.push(`%${p}%`); // protege contra SQL injection
  }

  const funcionarios = await new Promise((resolve, reject) => {
    connection.all(query, values, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  return funcionarios.reverse(); // Mostrar do mais recente pro antigo, pode mudar se quiser
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

  const agora = new Date().toISOString();

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
    agora, // data_admissao
    agora, // created_at
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          return reject({
            code: 400,
            message: "Erro de restrição: CPF duplicado ou campos inválidos.",
          });
        }
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
};

const deletarFuncionario = async (id) => {
  const query = `DELETE FROM funcionarios WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.run(query, [id], function (err) {
      if (err) return reject(err);
      if (this.changes === 0) return resolve(null); // Não achou para deletar
      resolve(this.changes); // Número de linhas deletadas
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
    genero,
    funcao,
    salario_base,
    tipo_comissao,
    valor_comissao,
    status = "ativo",
  } = dados;

  const updated_at = new Date().toISOString();

  const query = `
    UPDATE funcionarios
    SET nome = ?, cpf = ?, genero = ? , funcao = ? , telefone = ?, email = ?, data_admissao = ?, salario_base = ?, 
        tipo_comissao = ?, valor_comissao = ?, status = ?, updated_at = ?
    WHERE id = ?
  `;

  const values = [
    nome,
    cpf,
    genero,
    funcao,
    telefone,
    email,
    data_admissao,
    salario_base,
    tipo_comissao,
    valor_comissao,
    status,
    updated_at,
    id,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) return reject(err);
      if (this.changes === 0) return resolve(null);
      resolve(this.changes);
    });
  });
};

const procurarFuncionarioId = async (id) => {
  const query = `SELECT * FROM funcionarios WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.get(query, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

module.exports = {
  novoFuncionario,
  listarFuncionario,
  procurarFuncionarioId,
  deletarFuncionario,
  editarFuncionario,
};
