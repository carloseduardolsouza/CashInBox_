const connection = require("./db");

const iniciarNovoCaixa = async (dados) => {
  const { valor_abertura } = dados;

  const created_at = new Date().toISOString();

  const query = `
    INSERT INTO caixas (data_abertura , valor_abertura , valor_esperado , status)
    VALUES (? , ? , ? , ?)
  `;

  const values = [created_at, valor_abertura, valor_abertura, "aberto"];

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

const buscarCaixasAbertos = async () => {
  const query = `SELECT * FROM caixas WHERE status = "aberto" `;

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

  const queryInsert = `
    INSERT INTO movimentacoes (caixa_id , data , descricao , tipo , valor)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [id, created_at, descricao, tipo, valor];

  try {
    if (tipo === "entrada") {
      const caixas = await new Promise((resolve, reject) => {
        connection.all(
          `SELECT * FROM caixas WHERE status = "aberto"`,
          [],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      if (!caixas || caixas.length === 0)
        throw new Error("Nenhum caixa aberto encontrado.");

      const caixa = caixas[0];
      const novoSaldo = (caixa.saldo_adicionado += Number(valor));
      const novoSaldoRecebido = (caixa.total_recebido += Number(valor));
      const novoSaldoEsperado = (caixa.valor_esperado += Number(valor));

      await new Promise((resolve, reject) => {
        connection.run(
          `UPDATE caixas SET saldo_adicionado = ?, total_recebido = ? , valor_esperado = ? WHERE id = ?`,
          [novoSaldo, novoSaldoRecebido, novoSaldoEsperado, caixa.id],
          function (err) {
            if (err) reject(err);
            else resolve(this.changes);
          }
        );
      });
    }
    if (tipo === "saida") {
      const caixas = await new Promise((resolve, reject) => {
        connection.all(
          `SELECT * FROM caixas WHERE status = "aberto"`,
          [],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      if (!caixas || caixas.length === 0)
        throw new Error("Nenhum caixa aberto encontrado.");

      const caixa = caixas[0];
      const novoSaldo = (caixa.saldo_retirada += Number(valor));
      const novoSaldoEsperado = caixa.valor_esperado - Number(valor);

      await new Promise((resolve, reject) => {
        connection.run(
          `UPDATE caixas SET saldo_retirada = ? , valor_esperado = ? WHERE id = ?`,
          [novoSaldo, novoSaldoEsperado, caixa.id],
          function (err) {
            if (err) reject(err);
            else resolve(this.changes);
          }
        );
      });
    }

    const result = await new Promise((resolve, reject) => {
      connection.run(queryInsert, values, function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });

    return result;
  } catch (error) {
    console.error("Erro ao adicionar movimentação:", error);
    throw error;
  }
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

const fecharCaixa = async (id, dados) => {
  const { valor_fechamento } = dados;

  const query = `
      UPDATE caixas
      SET status = ?,
      data_fechamento = ?,
      valor_fechamento = ?
      WHERE id = ?
    `;

  const updatedAt = new Date().toISOString();

  return new Promise((resolve, reject) => {
    connection.run(
      query,
      ["fechado", updatedAt, valor_fechamento, id],

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

module.exports = {
  buscarCaixas,
  buscarCaixasAbertos,
  adicionarMovimentações,
  iniciarNovoCaixa,
  buscarMovimentações,
  fecharCaixa,
};
