const connection = require("./db");

const NovaVenda = async (dados) => {
  const {
    cliente_id,
    nome_cliente,
    funcionario_id,
    nome_funcionario,
    descontos,
    acrescimos,
    valor_total,
    status,
    observacoes,
    produtos,
    pagamentos,
  } = dados;

  const created_at = new Date().toISOString();
  const updated_at = created_at;

  const insertVendaQuery = `
    INSERT INTO vendas 
    (cliente_id, nome_cliente , funcionario_id, nome_funcionario , descontos, acrescimos, valor_total, status, observacoes, created_at, updated_at , data_venda)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? , ?)
  `;

  const vendaValues = [
    cliente_id || 0,
    nome_cliente || "Cliente final",
    funcionario_id || 0,
    nome_funcionario || "adimin",
    descontos,
    acrescimos,
    valor_total,
    status || "concluida",
    observacoes || "",
    created_at,
    updated_at,
    created_at,
  ];

  return new Promise((resolve, reject) => {
    connection.run(insertVendaQuery, vendaValues, async function (err) {
      if (err) {
        return reject(err);
      }

      const vendaId = this.lastID;

      try {
        // Inserir produtos
        for (const produto of produtos) {
          await new Promise((res, rej) => {
            const query = `
              INSERT INTO vendas_itens 
              (venda_id, produto_id, produto_nome, quantidade, preco_unitario, valor_total, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
              vendaId,
              produto.produto_id,
              produto.produto_nome,
              produto.quantidade,
              produto.preco_unitario,
              produto.valor_total,
              created_at,
            ];

            connection.run(query, values, (err) => {
              if (err) rej(err);
              else res();
            });
          });
        }

        // Inserir pagamentos
        for (const pagamento of pagamentos) {
          await new Promise((res, rej) => {
            const query = `
              INSERT INTO pagamentos 
              (venda_id, tipo_pagamento, valor)
              VALUES (?, ?, ?)
            `;

            const values = [vendaId, pagamento.tipo_pagamento, pagamento.valor];

            connection.run(query, values, (err) => {
              if (err) rej(err);
              else res();
            });
          });
        }

        resolve({ success: true, vendaId });
      } catch (error) {
        reject(error);
      }
    });
  });
};

const listarVendas = async (filtro, pesquisa) => {
  let query;
  let values = [];

  if (filtro == undefined && pesquisa == undefined) {
    query = `SELECT * FROM vendas WHERE status != 'orçamento'`;
  } else {
    query = `SELECT * FROM vendas WHERE nome LIKE ?`;
    values.push(`%${id}%`); // Isso garante aspas e evita SQL injection
  }

  const vendas = await new Promise((resolve, reject) => {
    connection.all(query, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  return vendas.reverse();
};

const listarOrcamentos = async (filtro, pesquisa) => {
  let query;
  let values = [];

  if (filtro == undefined && pesquisa == undefined) {
    query = `SELECT * FROM vendas WHERE status = 'orçamento'`;
  } else {
    query = `SELECT * FROM vendas WHERE nome LIKE ?`;
    values.push(`%${id}%`); // Isso garante aspas e evita SQL injection
  }

  const vendas = await new Promise((resolve, reject) => {
    connection.all(query, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  return vendas.reverse();
};

const produrarVendaId = async (id) => {
  const query = `SELECT * FROM vendas WHERE id = ${id}`;

  const produtos = await new Promise((resolve, reject) => {
    connection.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  return produtos;
};

const procurarProdutosVenda = async (id) => {
  const query = `SELECT * FROM vendas_itens WHERE venda_id = ${id}`;

  const venda = await new Promise((resolve, reject) => {
    connection.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  return venda;
};

const deletarVenda = async (id) => {
  const query = `DELETE FROM vendas WHERE id = ${id}`;

  await new Promise((resolve, reject) => {
    connection.run(query, function (err) {
      if (err) {
        reject(err); // Caso ocorra algum erro
      } else {
        resolve(this.lastID);
      }
    });
  });

  const queryDeleteItens = `DELETE FROM vendas_itens WHERE venda_id = ${id}`;
  await new Promise((resolve, reject) => {
    connection.run(queryDeleteItens, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });

  const queryFormaPagamento = `DELETE FROM pagamentos WHERE venda_id = ${id}`;
  return new Promise((resolve, reject) => {
    connection.run(queryDeleteItens, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

module.exports = {
  NovaVenda,
  listarVendas,
  produrarVendaId,
  procurarProdutosVenda,
  deletarVenda,
  listarOrcamentos,
};
