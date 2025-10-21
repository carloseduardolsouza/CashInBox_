const connection = require("./db");

/**
 * Adiciona uma movimentação (entrada ou saída) a um caixa
 * Atualiza o caixa com os valores corretos, dependendo do tipo da movimentação
 */
const adicionarMovimentacoes = async (dados) => {
  const { descricao, tipo, valor, tipo_pagamento = "dinheiro" , categoria } = dados;
  const created_at = new Date().toISOString();

  const insertQuery = `
    INSERT INTO movimentacoes (caixa_id ,data, descricao, tipo, valor , tipo_pagamento , categoria)
    VALUES (?, ?, ?, ?, ? , ? , ?)
  `;

  try {
    const values = [
      1,
      created_at,
      descricao,
      tipo,
      valor,
      tipo_pagamento,
      categoria
    ];

    return await new Promise((resolve, reject) => {
      connection.run(insertQuery, values, function (err) {
        if (err) return reject(err);
        resolve(this.lastID); // Retorna o ID da movimentação
      });
    });
  } catch (error) {
    console.error("Erro ao adicionar movimentação:", error);
    throw error;
  }
};

/**
 * Busca todas as movimentações
 */
const buscarMovimentacoes = async () => {
  const query = `SELECT * FROM movimentacoes`;

  return new Promise((resolve, reject) => {
    connection.all(query, (err, rows) => {
      if (err) return reject(err);
      resolve(rows.reverse());
    });
  });
};

// Exporta todas as funções
module.exports = {
  adicionarMovimentacoes,
  buscarMovimentacoes,
};
