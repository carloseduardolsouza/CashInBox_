const db = require("./db");

const infoHome = async () => {
  const vendas = await new Promise((resolve, reject) => {
    db.all(`SELECT * FROM vendas WHERE status != 'orçamento'`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  const faturamento = {};
  let faturamentoDia = 0;

  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  vendas.forEach((venda) => {
    const data = new Date(venda.data_venda);
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    const chave = `${ano}-${mes.toString().padStart(2, "0")}`;

    if (!faturamento[chave]) {
      faturamento[chave] = 0;
    }

    faturamento[chave] += venda.valor_total;

    // Se for do dia atual, soma no faturamentoDia
    if (
      data.getDate() === diaAtual &&
      data.getMonth() === mesAtual &&
      data.getFullYear() === anoAtual
    ) {
      faturamentoDia += venda.valor_total;
    }
  });

  const mesesAbreviados = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
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
      `SELECT COUNT(*) AS total FROM produtos WHERE estoque_atual <= estoque_minimo`,
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
    crediariosAtrasados,
    totalOrcamentos,
    produtosEstoqueMinimo,
  };
};

module.exports = {
  infoHome,
};
