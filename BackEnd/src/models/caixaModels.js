const connection = require("./db");

/**
 * Adiciona uma movimentação (entrada ou saída) a um caixa
 * Atualiza o caixa com os valores corretos, dependendo do tipo da movimentação
 */
const adicionarMovimentacoes = async (idCaixaParam, dados) => {
  const { descricao, tipo, valor, tipo_pagamento = "dinheiro" } = dados;
  const created_at = new Date().toISOString();

  const insertQuery = `
    INSERT INTO movimentacoes (caixa_id, data, descricao, tipo, valor , tipo_pagamento)
    VALUES (?, ?, ?, ?, ? , ?)
  `;

  try {
    // Busca o caixa aberto (objeto ou null)
    const caixa = await buscarCaixasAbertos();

    if (!caixa || !caixa.id) throw new Error("Nenhum caixa aberto encontrado.");

    // Usa o caixa encontrado para atualizar e inserir
    const caixaId = caixa.id;

    // Atualiza os valores do caixa dependendo do tipo
    if (tipo === "entrada") {
      const novoSaldoAdicionado = (caixa.saldo_adicionado || 0) + Number(valor);
      const novoTotalRecebido = (caixa.total_recebido || 0) + Number(valor);
      const novoValorEsperado = (caixa.valor_esperado || 0) + Number(valor);

      await new Promise((resolve, reject) => {
        connection.run(
          `UPDATE caixas SET saldo_adicionado = ?, total_recebido = ?, valor_esperado = ? WHERE id = ?`,
          [novoSaldoAdicionado, novoTotalRecebido, novoValorEsperado, caixaId],
          function (err) {
            if (err) return reject(err);
            resolve(this.changes);
          }
        );
      });
    } else if (tipo === "saida") {
      const novoSaldoRetirada = (caixa.saldo_retirada || 0) + Number(valor);
      const novoValorEsperado = (caixa.valor_esperado || 0) - Number(valor);

      await new Promise((resolve, reject) => {
        connection.run(
          `UPDATE caixas SET saldo_retirada = ?, valor_esperado = ? WHERE id = ?`,
          [novoSaldoRetirada, novoValorEsperado, caixaId],
          function (err) {
            if (err) return reject(err);
            resolve(this.changes);
          }
        );
      });
    }

    // Registra a movimentação usando o id do caixa aberto
    const values = [
      caixaId,
      created_at,
      descricao,
      tipo,
      valor,
      tipo_pagamento,
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
