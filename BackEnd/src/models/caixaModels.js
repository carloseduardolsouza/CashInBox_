const connection = require("./db");

/**
 * Inicia um novo caixa com os dados recebidos
 * Define data de abertura, valor inicial e status como "aberto"
 */
const iniciarNovoCaixa = async (dados) => {
  const { valor_abertura } = dados;
  const created_at = new Date().toISOString();

  const query = `
    INSERT INTO caixas (data_abertura, valor_abertura, valor_esperado, status)
    VALUES (?, ?, ?, ?)
  `;

  const values = [created_at, valor_abertura, valor_abertura, "aberto"];

  return new Promise((resolve, reject) => {
    connection.run(query, values, function (err) {
      if (err) return reject(err);
      resolve(this.lastID); // Retorna o ID do novo caixa criado
    });
  });
};

/**
 * Retorna todos os caixas registrados
 */
const buscarCaixas = async () => {
  const query = `SELECT * FROM caixas`;

  return new Promise((resolve, reject) => {
    connection.all(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

/**
 * Retorna todos os caixas com status "aberto"
 */
const buscarCaixasAbertos = async () => {
  const queryCaixa = `SELECT * FROM caixas WHERE status = "aberto"`;

  return new Promise((resolve, reject) => {
    connection.all(queryCaixa, [], async (err, caixas) => {
      if (err) return reject(err);

      if (!caixas.length) return resolve([]);

      const caixa = caixas[0];
      const caixaId = caixa.id;

      const queryMovimentacoes = `
        SELECT tipo_pagamento, SUM(valor) AS total
        FROM movimentacoes
        WHERE caixa_id = ?
        GROUP BY tipo_pagamento
      `;

      connection.all(queryMovimentacoes, [caixaId], (err, resumoRows) => {
        if (err) return reject(err);

        // Inicializa com todos os tipos de pagamento zerados
        const meiosPagamento = [
          "pix",
          "cartão de credito",
          "cartão de debito",
          "crediario propio",
          "dinheiro",
          "cheque",
        ];

        const resumo_caixa = {};
        meiosPagamento.forEach((tipo) => {
          resumo_caixa[tipo] = 0;
        });

        // Preenche os que realmente tem valor
        resumoRows.forEach(({ tipo_pagamento, total }) => {
          resumo_caixa[tipo_pagamento] = parseFloat(total);
        });

        resolve({
          ...caixa,
          resumo_caixa,
        });
      });
    });
  });
};

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
 * Busca todas as movimentações de um caixa específico
 */
const buscarMovimentacoes = async (id) => {
  const query = `SELECT * FROM movimentacoes WHERE caixa_id = ?`;

  return new Promise((resolve, reject) => {
    connection.all(query, [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

/**
 * Fecha um caixa específico, atualizando status, valor de fechamento e data
 */
const fecharCaixa = async (id, dados) => {
  const { valor_fechamento } = dados;
  const updatedAt = new Date().toISOString();

  const query = `
    UPDATE caixas
    SET status = ?, data_fechamento = ?, valor_fechamento = ?
    WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    connection.run(
      query,
      ["fechado", updatedAt, valor_fechamento, id],
      function (err) {
        if (err) return reject(err);
        if (this.changes === 0) return resolve(null); // Nenhum caixa encontrado com esse ID
        resolve(this.changes); // Quantidade de linhas afetadas
      }
    );
  });
};

// Exporta todas as funções
module.exports = {
  buscarCaixas,
  buscarCaixasAbertos,
  adicionarMovimentacoes,
  iniciarNovoCaixa,
  buscarMovimentacoes,
  fecharCaixa,
};
