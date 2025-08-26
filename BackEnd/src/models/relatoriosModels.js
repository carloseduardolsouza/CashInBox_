const db = require("./db");

const infoHome = async () => {
  const vendas = await new Promise((resolve, reject) => {
    db.all(`SELECT * FROM vendas WHERE status == 'concluida'`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  const crediarioPago = await new Promise((resolve, reject) => {
    db.all(`SELECT * FROM crediario_parcelas WHERE status = 'pago'`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  const clientesNovosMes = await new Promise((resolve, reject) => {
  db.all(
    `SELECT * 
     FROM clientes 
     WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`,
    (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    }
  );
});

  const faturamento = {};
  let faturamentoDia = 0;

  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  // --- Soma vendas ---
  vendas.forEach((venda) => {
    const data = new Date(venda.data_venda);
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    const chave = `${ano}-${mes.toString().padStart(2, "0")}`;

    if (!faturamento[chave]) faturamento[chave] = 0;

    faturamento[chave] += venda.valor_total;

    if (data.getDate() === diaAtual && data.getMonth() === mesAtual && data.getFullYear() === anoAtual) {
      faturamentoDia += venda.valor_total;
    }
  });

  // --- Soma parcelas de crediário pagas ---
  crediarioPago.forEach((parcela) => {
    if (!parcela.data_pagamento || !parcela.valor_pago) return; // ignora se não tiver dados
    const data = new Date(parcela.data_pagamento);
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    const chave = `${ano}-${mes.toString().padStart(2, "0")}`;

    if (!faturamento[chave]) faturamento[chave] = 0;

    faturamento[chave] += parcela.valor_pago;

    if (data.getDate() === diaAtual && data.getMonth() === mesAtual && data.getFullYear() === anoAtual) {
      faturamentoDia += parcela.valor_pago;
    }
  });

  const mesesAbreviados = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];

  const agora = new Date();
  const faturamentoUltimosMeses = [];

  for (let i = 0; i < 7; i++) {
    const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const ano = data.getFullYear();
    const mes = data.getMonth() + 1;
    const chave = `${ano}-${mes.toString().padStart(2, "0")}`;
    const valor = faturamento[chave] || 0;

    faturamentoUltimosMeses.push({
      chave,
      mes: mesesAbreviados[mes - 1],
      faturamento: valor,
    });
  }

  faturamentoUltimosMeses.reverse();

  for (let i = 0; i < faturamentoUltimosMeses.length; i++) {
    if (i === 0) {
      faturamentoUltimosMeses[i].variacao = null;
    } else {
      const atual = faturamentoUltimosMeses[i].faturamento;
      const anterior = faturamentoUltimosMeses[i - 1].faturamento;

      let variacao = 0;
      if (anterior > 0) variacao = ((atual - anterior) / anterior) * 100;
      else if (atual > 0) variacao = 100;

      faturamentoUltimosMeses[i].variacao = parseFloat(variacao.toFixed(2));
    }
  }

  const crediariosAtrasados = await new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) AS total FROM crediario_parcelas WHERE status = 'vencido'`,
      (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      }
    );
  });

  const clientesAtivos = await new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as total FROM clientes`, (err, row) => {
      if (err) reject(err);
      else resolve(row.total);
    });
  });

  const totalOrcamentos = await new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) AS total FROM vendas WHERE status = 'orçamento'`,
      (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      }
    );
  });

  const produtosEstoqueMinimo = await new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) AS total FROM produtos WHERE estoque_atual <= estoque_minimo AND ativo = 1`,
      (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      }
    );
  });

  return {
    faturamento: faturamentoUltimosMeses.map(({ chave, ...resto }) => resto),
    faturamentoDia: parseFloat(faturamentoDia.toFixed(2)),
    clientesAtivos,
    clientesNovosMes : clientesNovosMes.length,
    crediariosAtrasados,
    totalOrcamentos,
    produtosEstoqueMinimo,
  };
};


const resumoRelatorios = async () => {
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1; // 1-12
  const anoAtual = hoje.getFullYear();

  // Definir mês anterior
  let mesAnterior = mesAtual - 1;
  let anoAnterior = anoAtual;
  if (mesAnterior === 0) {
    mesAnterior = 12;
    anoAnterior -= 1;
  }

  // Função auxiliar para pegar dados de faturamento e vendas por mês/ano
  const getDadosMes = async (mes, ano) => {
    const vendas = await new Promise((resolve, reject) => {
      db.all(
        `SELECT valor_total FROM vendas 
         WHERE status != 'orçamento' 
           AND strftime('%m', data_venda) = ? 
           AND strftime('%Y', data_venda) = ?`,
        [mes.toString().padStart(2, "0"), ano.toString()],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const faturamento = vendas.reduce((sum, v) => sum + v.valor_total, 0);
    const qtdVendas = vendas.length;
    const ticketMedio = qtdVendas > 0 ? faturamento / qtdVendas : 0;

    return { faturamento, qtdVendas, ticketMedio };
  };

  const dadosAtual = await getDadosMes(mesAtual, anoAtual);
  const dadosAnterior = await getDadosMes(mesAnterior, anoAnterior);

  // Função auxiliar para calcular variação percentual
  const variacao = (atual, anterior) => {
    if (anterior > 0) return parseFloat((((atual - anterior) / anterior) * 100).toFixed(2));
    if (atual > 0) return 100;
    return 0;
  };

  return {
    faturamentoMes: parseFloat(dadosAtual.faturamento.toFixed(2)),
    variacaoFaturamento: variacao(dadosAtual.faturamento, dadosAnterior.faturamento),
    vendasMes: dadosAtual.qtdVendas,
    variacaoVendas: variacao(dadosAtual.qtdVendas, dadosAnterior.qtdVendas),
    ticketMedio: parseFloat(dadosAtual.ticketMedio.toFixed(2)),
    variacaoTicketMedio: variacao(dadosAtual.ticketMedio, dadosAnterior.ticketMedio)
  };
};


module.exports = {
  infoHome,
  resumoRelatorios
};
