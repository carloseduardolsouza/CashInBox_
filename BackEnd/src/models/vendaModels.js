const connection = require("./db");
const caixaControlles = require("../controllers/caixaControlles");
const { promisify } = require("util");
const runAsync = promisify(connection.run.bind(connection));
const allAsync = promisify(connection.all.bind(connection));

const NovaVenda = async (dados) => {
  const {
    cliente_id,
    nome_cliente,
    funcionario_id,
    nome_funcionario,
    descontos,
    acrescimos,
    valor_total,
    total_bruto,
    status,
    observacoes,
    produtos,
    pagamentos,
  } = dados;

  const created_at = new Date().toISOString();
  const updated_at = created_at;

  const insertVendaQuery = `
    INSERT INTO vendas 
    (cliente_id, nome_cliente , funcionario_id, nome_funcionario , descontos, acrescimos, valor_total, total_bruto, status, observacoes, created_at, updated_at , data_venda)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? , ? , ?)
  `;

  const vendaValues = [
    cliente_id || 0,
    nome_cliente || "Cliente final",
    funcionario_id || 0,
    nome_funcionario || "admin",
    descontos,
    acrescimos,
    valor_total,
    total_bruto,
    status || "concluida",
    observacoes || "",
    created_at,
    updated_at,
    created_at,
  ];

  try {
    // Insere a venda e espera o resultado
    await runAsync(insertVendaQuery, vendaValues);
    const vendaId = (await allAsync("SELECT last_insert_rowid() AS id"))[0].id;

    // Buscar caixa aberto (função interna, sem fetch)
    const caixaAberto = await caixaControlles.buscarCaixasAbertos();

    if (caixaAberto.length > 0) {
      let dadosMovimentacao = {
        id: caixaAberto[0].id,
        descricao: `venda #${vendaId}`,
        tipo: "entrada",
        valor: valor_total,
      };

      // Aqui você tem que chamar a função que adiciona movimentação
      await caixaControlles.adicionarMovimentacaoHandler(
        caixaAberto[0].id,
        dadosMovimentacao
      );
    }

    // Inserir produtos
    for (const produto of produtos) {
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

      await runAsync(query, values);
    }

    // Inserir pagamentos
    for (const pagamento of pagamentos) {
      const query = `
        INSERT INTO pagamentos 
        (venda_id, tipo_pagamento, valor)
        VALUES (?, ?, ?)
      `;

      const values = [vendaId, pagamento.tipo_pagamento, pagamento.valor];

      await runAsync(query, values);
    }

    return { success: true, vendaId };
  } catch (error) {
    throw error;
  }
};

const NovaVendaCrediario = async (dados) => {
  const {
    cliente_id,
    nome_cliente,
    funcionario_id,
    nome_funcionario,
    descontos = 0,
    acrescimos = 0,
    valor_total,
    total_bruto,
    observacoes = "",
    produtos,
    pagamentos,
    parcelas,
  } = dados;

  const now = new Date();
  const created_at = now.toISOString();
  const updated_at = created_at;

  if (!Array.isArray(produtos) || produtos.length === 0) {
    throw new Error("A venda deve conter pelo menos um produto.");
  }

  if (!Array.isArray(parcelas) || parcelas.length === 0) {
    throw new Error("É necessário informar ao menos uma parcela.");
  }

  const insertVendaQuery = `
    INSERT INTO vendas 
    (cliente_id, nome_cliente, funcionario_id, nome_funcionario, descontos, acrescimos, valor_total, total_bruto, status, observacoes, created_at, updated_at, data_venda)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const vendaValues = [
    cliente_id || 0,
    nome_cliente?.trim() || "Cliente final",
    funcionario_id || 0,
    nome_funcionario?.trim() || "admin",
    descontos,
    acrescimos,
    valor_total,
    total_bruto,
    "Crediario pendente", // <- agora usa o valor passado
    observacoes,
    created_at,
    updated_at,
    created_at,
  ];

  try {
    await runAsync("BEGIN TRANSACTION");

    await runAsync(insertVendaQuery, vendaValues);
    const vendaId = (await allAsync("SELECT last_insert_rowid() AS id"))[0].id;

    // Produtos
    for (const produto of produtos) {
      const {
        produto_id,
        produto_nome,
        quantidade,
        preco_unitario,
        valor_total: valor_total_produto, // <- renomeado
      } = produto;

      if (
        !produto_id ||
        !produto_nome ||
        quantidade == null ||
        preco_unitario == null ||
        valor_total_produto == null
      ) {
        throw new Error("Dados incompletos de produto.");
      }

      const insertProdutoQuery = `
        INSERT INTO vendas_itens 
        (venda_id, produto_id, produto_nome, quantidade, preco_unitario, valor_total, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const produtoValues = [
        vendaId,
        produto_id,
        produto_nome.trim(),
        quantidade,
        preco_unitario,
        valor_total_produto,
        created_at,
      ];

      await runAsync(insertProdutoQuery, produtoValues);
    }

    // Parcelas
    for (const parcela of parcelas) {
      const {
        numero_parcela,
        data_vencimento,
        valor_parcela,
        status: status_parcela = "pendente",
      } = parcela;

      if (numero_parcela == null || !data_vencimento || valor_parcela == null) {
        throw new Error("Dados incompletos em uma das parcelas.");
      }

      const insertParcelaQuery = `
        INSERT INTO crediario_parcelas 
        (id_cliente, nome_cliente, id_venda, numero_parcela, data_vencimento, valor_parcela, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const parcelaValues = [
        cliente_id || 0,
        nome_cliente?.trim() || "Cliente final",
        vendaId,
        numero_parcela,
        data_vencimento,
        valor_parcela,
        status_parcela,
      ];

      await runAsync(insertParcelaQuery, parcelaValues);
    }

    // Inserir pagamentos
    const query = `
      INSERT INTO pagamentos 
      (venda_id, tipo_pagamento, valor)
      VALUES (?, ?, ?)
    `;

    const values = [vendaId, "crediario propio", 0];

    await runAsync(query, values);

    await runAsync("COMMIT");

    return {
      success: true,
      vendaId,
      mensagem: "Venda a prazo registrada com sucesso.",
    };
  } catch (error) {
    await runAsync("ROLLBACK");
    console.error("Erro ao registrar venda crediário:", error); // <- log mais completo
    throw new Error("Erro ao registrar venda crediário. Nada foi salvo.");
  }
};

const listarVendas = async (filtro) => {
  let query;
  let values = [];

  if (!filtro) {
    query = `SELECT * FROM vendas WHERE status != 'orçamento'`;
  } else {
    // Adiciona hora 00:00:00.000Z para garantir que traga tudo a partir do começo do dia
    const filtroFormatado = `${filtro}T00:00:00.000Z`;
    query = `SELECT * FROM vendas WHERE status != 'orçamento' AND data_venda >= ?`;
    values.push(filtroFormatado);
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

const listarVendasCrediario = async () => {
  let query;
  let values = [];

  query = `
    SELECT * 
    FROM crediario_parcelas 
    WHERE status != "pago" 
    ORDER BY data_vencimento ASC
  `;

  const vendas = await new Promise((resolve, reject) => {
    connection.all(query, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  return vendas;
};

const listarVendasCliente = async (id) => {
  let query;
  let values = [];

  query = `SELECT * FROM vendas WHERE status != 'orçamento' AND cliente_id = ${id}`;

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

const listarVendasCrediarioVenda = async (id) => {
  let query;
  let values = [];

  query = `SELECT * FROM crediario_parcelas WHERE id_venda = ${id}`;

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

const listarOrcamentoCliente = async (id) => {
  let query;
  let values = [];

  query = `SELECT * FROM vendas WHERE status == 'orçamento' AND cliente_id = ${id}`;

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

const listarVendasFuncionario = async (id) => {
  let query;
  let values = [];

  query = `SELECT * FROM vendas WHERE status != 'orçamento' AND funcionario_id = ${id}`;

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

const receberVendaCrediario = async (id) => {
  const dataPagamento = new Date().toISOString();

  const query = `
    UPDATE crediario_parcelas 
    SET status = ?, data_pagamento = ? 
    WHERE id = ?
  `;

  const values = ["pago", dataPagamento, id];

  try {
    // Atualiza o status da parcela
    await runAsync(query, values);

    // Pega os dados da parcela pra usar na movimentação
    const parcela = await allAsync(
      `SELECT * FROM crediario_parcelas WHERE id = ?`,
      [id]
    );

    if (!parcela || parcela.length === 0) {
      throw new Error("Parcela não encontrada");
    }

    const valorParcela = parcela[0].valor_parcela;

    // Busca o caixa aberto
    const caixaAberto = await caixaControlles.buscarCaixasAbertos();

    if (caixaAberto.length > 0) {
      const dadosMovimentacao = {
        id: caixaAberto[0].id,
        descricao: `Pagamento crediário ,venda #${id}`,
        tipo: "entrada",
        valor: valorParcela,
      };

      await caixaControlles.adicionarMovimentacaoHandler(
        caixaAberto[0].id,
        dadosMovimentacao
      );
    }

    return {
      success: true,
      updatedId: id,
      valor: valorParcela,
    };
  } catch (err) {
    throw err;
  }
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

const procurarPagamentoVenda = async (id) => {
  const query = `SELECT * FROM pagamentos WHERE venda_id = ${id}`;

  const pagamentos = await new Promise((resolve, reject) => {
    connection.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  return pagamentos;
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
  new Promise((resolve, reject) => {
    connection.run(queryDeleteItens, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });

  const queryParcelasCrediario = `DELETE FROM crediario_parcelas WHERE id_venda = ${id}`;
  return new Promise((resolve, reject) => {
    connection.run(queryParcelasCrediario, function (err) {
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
  NovaVendaCrediario,
  listarVendasCrediario,
  listarVendas,
  listarVendasCliente,
  listarOrcamentoCliente,
  listarVendasFuncionario,
  produrarVendaId,
  procurarProdutosVenda,
  deletarVenda,
  receberVendaCrediario,
  listarOrcamentos,
  procurarPagamentoVenda,
  listarVendasCrediarioVenda,
};
