const connection = require("./db");

// 🆕 Criar nova conta
const novaConta = async (dados) => {
  const {
    descricao,
    fornecedor,
    categoria,
    valor_total,
    data_emissao,
    data_vencimento,
    forma_pagamento,
    parcelado,
    observacoes,
    status,
    data_pagamento,
  } = dados;

  const query = `
    INSERT INTO contas_a_pagar (
      descricao, fornecedor, categoria, valor_total, 
      data_emissao, data_vencimento, forma_pagamento, 
      parcelado, observacoes, status, data_pagamento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    descricao,
    fornecedor,
    categoria,
    valor_total,
    data_emissao,
    data_vencimento,
    forma_pagamento,
    parcelado ? 1 : 0,
    observacoes || null,
    status || "pendente",
    data_pagamento || null,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

// 🔍 Listar todas as contas
const contasAll = async () => {
  const query = `SELECT * FROM contas_a_pagar WHERE status != 'pago' ORDER BY data_vencimento ASC`;

  return new Promise((resolve, reject) => {
    connection.all(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// ✏️ Editar uma conta existente
const editarConta = async (id, dados) => {
  const {
    descricao,
    fornecedor,
    categoria,
    valor_total,
    data_emissao,
    data_vencimento,
    forma_pagamento,
    parcelado,
    observacoes,
    status,
    data_pagamento,
  } = dados;

  const query = `
    UPDATE contas_a_pagar SET 
      descricao = ?, fornecedor = ?, categoria = ?, valor_total = ?,
      data_emissao = ?, data_vencimento = ?, forma_pagamento = ?,
      parcelado = ?, observacoes = ?, status = ?, data_pagamento = ?
    WHERE id = ?
  `;

  const values = [
    descricao,
    fornecedor,
    categoria,
    valor_total,
    data_emissao,
    data_vencimento,
    forma_pagamento,
    parcelado ? 1 : 0,
    observacoes || null,
    status || "pendente",
    data_pagamento || null,
    id,
  ];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

// ✅ Marcar conta como paga
const pagarConta = async (id, data_pagamento) => {
  const query = `
    UPDATE contas_a_pagar 
    SET status = 'pago', data_pagamento = ?
    WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    connection.run(query, [data_pagamento, id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

// 🗑️ Deletar uma conta
const deletarConta = async (id) => {
  const query = `DELETE FROM contas_a_pagar WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.run(query, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

module.exports = {
  novaConta,
  contasAll,
  pagarConta,
  editarConta,
  deletarConta,
};
