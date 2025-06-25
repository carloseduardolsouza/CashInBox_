const connection = require("./db");
const caixaControlles = require("../controllers/caixaController");
const { promisify } = require("util");

// Promisify pra evitar callbacks infernais
const runAsync = promisify(connection.run.bind(connection));
const allAsync = promisify(connection.all.bind(connection));

/**
 * Cria uma nova venda e trata produtos, pagamentos e atualização do cliente e caixa.
 */
const novaVenda = async (dados) => {
  const {
    cliente_id,
    nome_cliente,
    funcionario_id,
    nome_funcionario,
    descontos = 0,
    acrescimos = 0,
    valor_total,
    total_bruto,
    status = "concluida",
    observacoes = "",
    produtos = [],
    pagamentos = [],
  } = dados;

  const timestamp = new Date().toISOString();

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
    status,
    observacoes,
    timestamp,
    timestamp,
    timestamp,
  ];

  try {
    // Insere a venda
    await runAsync(insertVendaQuery, vendaValues);

    // Pega o ID da venda recém-criada
    const vendaId = (await allAsync("SELECT last_insert_rowid() AS id"))[0].id;

    // Atualiza total_compras do cliente, se não for orçamento e cliente válido
    if (status !== "orçamento" && cliente_id && cliente_id !== 0) {
      const cliente = await allAsync(
        "SELECT total_compras FROM clientes WHERE id = ?",
        [cliente_id]
      );

      if (cliente.length) {
        const totalAtual = cliente[0].total_compras || 0;
        const novoTotal = totalAtual + valor_total;

        await runAsync("UPDATE clientes SET total_compras = ? WHERE id = ?", [
          novoTotal,
          cliente_id,
        ]);
      }
    }

    // Busca caixa aberto para registrar movimentação
    const caixaAberto = await caixaControlles.buscarCaixasAbertos();

    if (caixaAberto.length > 0) {
      const movimentacao = {
        id: caixaAberto[0].id,
        descricao: `Venda #${vendaId}`,
        tipo: "entrada",
        valor: valor_total,
      };

      await caixaControlles.adicionarMovimentacaoHandler(
        caixaAberto[0].id,
        movimentacao
      );
    }

    // Insere os produtos da venda
    for (const produto of produtos) {
      const {
        produto_id,
        produto_nome,
        quantidade,
        preco_unitario,
        valor_total: valorTotalProduto,
      } = produto;

      if (
        !produto_id ||
        !produto_nome ||
        quantidade == null ||
        preco_unitario == null ||
        valorTotalProduto == null
      ) {
        throw new Error("Produto com dados incompletos.");
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
        valorTotalProduto,
        timestamp,
      ];

      await runAsync(insertProdutoQuery, produtoValues);
    }

    // Insere os pagamentos
    for (const pagamento of pagamentos) {
      const { tipo_pagamento, valor } = pagamento;
      if (!tipo_pagamento || valor == null) {
        throw new Error("Pagamento com dados incompletos.");
      }

      const insertPagamentoQuery = `
        INSERT INTO pagamentos (venda_id, tipo_pagamento, valor)
        VALUES (?, ?, ?)
      `;

      await runAsync(insertPagamentoQuery, [vendaId, tipo_pagamento, valor]);
    }

    return { success: true, vendaId };
  } catch (error) {
    console.error("Erro ao criar nova venda:", error);
    throw error;
  }
};

/**
 * Registra uma venda a prazo (crediário) com produtos, parcelas e pagamentos.
 */
const novaVendaCrediario = async (dados) => {
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
    produtos = [],
    parcelas = [],
  } = dados;

  if (!produtos.length)
    throw new Error("A venda deve conter pelo menos um produto.");
  if (!parcelas.length)
    throw new Error("É necessário informar ao menos uma parcela.");

  const timestamp = new Date().toISOString();

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
    "Crediario pendente",
    observacoes,
    timestamp,
    timestamp,
    timestamp,
  ];

  try {
    await runAsync("BEGIN TRANSACTION");

    await runAsync(insertVendaQuery, vendaValues);
    const vendaId = (await allAsync("SELECT last_insert_rowid() AS id"))[0].id;

    // Inserir produtos
    for (const produto of produtos) {
      const {
        produto_id,
        produto_nome,
        quantidade,
        preco_unitario,
        valor_total: valorTotalProduto,
      } = produto;

      if (
        !produto_id ||
        !produto_nome ||
        quantidade == null ||
        preco_unitario == null ||
        valorTotalProduto == null
      ) {
        throw new Error("Produto com dados incompletos.");
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
        valorTotalProduto,
        timestamp,
      ];

      await runAsync(insertProdutoQuery, produtoValues);
    }

    // Inserir parcelas do crediário
    for (const parcela of parcelas) {
      const {
        numero_parcela,
        data_vencimento,
        valor_parcela,
        status: statusParcela = "pendente",
      } = parcela;

      if (numero_parcela == null || !data_vencimento || valor_parcela == null) {
        throw new Error("Parcela com dados incompletos.");
      }

      const insertParcelaQuery = `
        INSERT INTO crediario_parcelas 
        (id_cliente, nome_cliente, id_venda, numero_parcela, data_vencimento, valor_parcela, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const parcelaValues = [
        cliente_id || 0,
        nome_cliente?.trim(),
        vendaId,
        numero_parcela,
        data_vencimento,
        valor_parcela,
        statusParcela,
      ];

      await runAsync(insertParcelaQuery, parcelaValues);
    }

    // Inserir pagamento inicial (0) como crediário
    await runAsync(
      `INSERT INTO pagamentos (venda_id, tipo_pagamento, valor) VALUES (?, ?, ?)`,
      [vendaId, "crediario propio", 0]
    );

    await runAsync("COMMIT");

    return {
      success: true,
      vendaId,
      mensagem: "Venda a prazo registrada com sucesso.",
    };
  } catch (error) {
    await runAsync("ROLLBACK");
    console.error("Erro ao registrar venda crediário:", error);
    throw new Error("Erro ao registrar venda crediário. Nada foi salvo.");
  }
};

/**
 * Lista vendas filtrando por data mínima e status != orçamento
 */
const listarVendas = async (filtro) => {
  let query = `SELECT * FROM vendas WHERE status != 'orçamento'`;
  const values = [];

  if (filtro) {
    const filtroFormatado = `${filtro}T00:00:00.000Z`;
    query += ` AND data_venda >= ?`;
    values.push(filtroFormatado);
  }

  const vendas = await allAsync(query, values);
  return vendas.reverse();
};

/**
 * Lista todas parcelas de crediário não pagas, ordenadas por vencimento
 */
const listarVendasCrediario = async () => {
  const query = `
    SELECT * 
    FROM crediario_parcelas 
    WHERE status != 'pago' 
    ORDER BY data_vencimento ASC
  `;

  return allAsync(query);
};

/**
 * Lista parcelas de crediário pendentes de um cliente
 */
const listarVendasCrediarioCliente = async (id) => {
  const query = `
    SELECT * 
    FROM crediario_parcelas 
    WHERE status != "pago" 
      AND id_cliente = ? 
    ORDER BY data_vencimento ASC
  `;

  return allAsync(query, [id]);
};

/**
 * Lista vendas concluídas (sem orçamento) de um cliente
 */
const listarVendasCliente = async (id) => {
  const query = `SELECT * FROM vendas WHERE status != 'orçamento' AND cliente_id = ?`;
  const vendas = await allAsync(query, [id]);
  return vendas.reverse();
};

/**
 * Lista parcelas do crediário de uma venda específica
 */
const listarVendasCrediarioVenda = async (id) => {
  const query = `SELECT * FROM crediario_parcelas WHERE id_venda = ?`;
  const vendas = await allAsync(query, [id]);
  return vendas.reverse();
};

/**
 * Lista vendas de um funcionário (sem orçamentos)
 */
const listarVendasFuncionario = async (id) => {
  const query = `SELECT * FROM vendas WHERE status != 'orçamento' AND funcionario_id = ?`;
  const vendas = await allAsync(query, [id]);
  return vendas.reverse();
};

/**
 * Marca parcela do crediário como paga, registra data e valor pago, atualiza caixa.
 */
const receberVendaCrediario = async (id, dados) => {
  const { data, valor_pago } = dados;

  const query = `
    UPDATE crediario_parcelas 
    SET status = ?, data_pagamento = ?, valor_pago = ?
    WHERE id = ?
  `;

  try {
    await runAsync(query, ["pago", data, valor_pago, id]);

    // Busca parcela atualizada
    const parcela = await allAsync(
      `SELECT * FROM crediario_parcelas WHERE id = ?`,
      [id]
    );

    if (!parcela.length) {
      throw new Error("Parcela não encontrada");
    }

    const valorParcela = parcela[0].valor_parcela;
    const idVenda = parcela[0].id_venda;

    // Atualiza caixa com a entrada do pagamento
    const caixaAberto = await caixaControlles.buscarCaixasAbertos();

    if (caixaAberto.length > 0) {
      const movimentacao = {
        id: caixaAberto[0].id,
        descricao: `Pagamento crediário, venda #${idVenda}`,
        tipo: "entrada",
        valor: valorParcela,
      };

      await caixaControlles.adicionarMovimentacaoHandler(
        caixaAberto[0].id,
        movimentacao
      );
    }

    // Atualiza status da venda com formato "parcelasPagas/parcelasTotal" ou "concluida"
    const [totalParcelas, parcelasPagas] = await Promise.all([
      allAsync(
        `SELECT COUNT(*) as total FROM crediario_parcelas WHERE id_venda = ?`,
        [idVenda]
      ),
      allAsync(
        `SELECT COUNT(*) as pagas FROM crediario_parcelas WHERE id_venda = ? AND status = 'pago'`,
        [idVenda]
      ),
    ]);

    const total = totalParcelas[0].total;
    const pagas = parcelasPagas[0].pagas;

    const statusAtualizado =
      pagas === total ? "concluida" : `${pagas}/${total}`;

    await runAsync(`UPDATE vendas SET status = ? WHERE id = ?`, [
      statusAtualizado,
      idVenda,
    ]);

    return {
      success: true,
      updatedId: id,
      valor: valorParcela,
      statusVenda: statusAtualizado,
    };
  } catch (err) {
    console.error("Erro ao receber venda crediário:", err);
    throw err;
  }
};

/**
 * Lista orçamentos com filtro por nome do cliente (LIKE)
 */
const listarOrcamentos = async () => {
  const query = `SELECT * FROM vendas WHERE LOWER(status) = 'orçamento'`;
  const vendas = await allAsync(query);
  return vendas.reverse();
};

/**
 * Lista orçamentos (status = orçamento) de um cliente
 */
const listarOrcamentoCliente = async (id) => {
  const query = `SELECT * FROM vendas WHERE status = 'orçamento' AND cliente_id = ?`;
  const vendas = await allAsync(query, [id]);
  return vendas.reverse();
};

/**
 * Busca venda pelo ID
 */
const procurarVendaId = async (id) => {
  const query = `SELECT * FROM vendas WHERE id = ?`;
  const produtos = await allAsync(query, [id]);
  return produtos;
};

/**
 * Busca produtos associados a uma venda
 */
const procurarProdutosVenda = async (id) => {
  const query = `SELECT * FROM vendas_itens WHERE venda_id = ?`;
  const venda = await allAsync(query, [id]);
  return venda;
};

/**
 * Busca pagamentos associados a uma venda
 */
const procurarPagamentoVenda = async (id) => {
  const query = `SELECT * FROM pagamentos WHERE venda_id = ?`;
  const pagamentos = await allAsync(query, [id]);
  return pagamentos;
};

/**
 * Deleta venda e atualiza total_compras do cliente se necessário
 */
const deletarVenda = async (id) => {
  try {
    const vendaInfo = await allAsync(
      "SELECT cliente_id, valor_total, status FROM vendas WHERE id = ?",
      [id]
    );

    if (!vendaInfo.length) {
      throw new Error("Venda não encontrada.");
    }

    const { cliente_id, valor_total, status } = vendaInfo[0];

    // Deleta itens relacionados (ordem importante)
    await runAsync("DELETE FROM vendas_itens WHERE venda_id = ?", [id]);
    await runAsync("DELETE FROM pagamentos WHERE venda_id = ?", [id]);
    await runAsync("DELETE FROM crediario_parcelas WHERE id_venda = ?", [id]);

    // Deleta a venda
    await runAsync("DELETE FROM vendas WHERE id = ?", [id]);

    // Atualiza total_compras do cliente, se aplicável
    if (status !== "orçamento" && cliente_id && cliente_id !== 0) {
      const cliente = await allAsync(
        "SELECT total_compras FROM clientes WHERE id = ?",
        [cliente_id]
      );

      if (cliente.length) {
        const totalAtual = cliente[0].total_compras || 0;
        const novoTotal = Math.max(0, totalAtual - valor_total);

        await runAsync("UPDATE clientes SET total_compras = ? WHERE id = ?", [
          novoTotal,
          cliente_id,
        ]);
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Erro ao deletar venda:", err.message);
    throw err;
  }
};

module.exports = {
  novaVenda,
  novaVendaCrediario,
  listarVendasCrediario,
  listarVendas,
  listarVendasCliente,
  listarOrcamentoCliente,
  listarVendasFuncionario,
  procurarVendaId,
  procurarProdutosVenda,
  procurarPagamentoVenda,
  deletarVenda,
  receberVendaCrediario,
  listarOrcamentos,
  listarVendasCrediarioVenda,
  listarVendasCrediarioCliente,
};
