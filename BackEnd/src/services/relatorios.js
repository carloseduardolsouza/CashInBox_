const connection = require("../models/db");

const calcularFaturamentoMensal = async (req, res) => {
  try {
    const query = `SELECT * FROM vendas WHERE status != 'orçamento'`;

    const vendas = await new Promise((resolve, reject) => {
      connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    const faturamento = {};

    // Agrupa vendas por ano-mês
    vendas.forEach(venda => {
      const data = new Date(venda.data_venda);
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();
      const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

      if (!faturamento[chave]) {
        faturamento[chave] = 0;
      }

      faturamento[chave] += venda.valor_total;
    });

    const mesesAbreviados = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    // Gera os últimos 7 meses
    const agora = new Date();
    const faturamentoUltimosMeses = [];

    for (let i = 0; i < 7; i++) {
      const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const ano = data.getFullYear();
      const mes = data.getMonth() + 1;
      const chave = `${ano}-${mes.toString().padStart(2, '0')}`;
      const valor = faturamento[chave] || 0;

      faturamentoUltimosMeses.push({
        chave, // Mantém a chave interna, pode ser útil pra debug
        mes: `${mesesAbreviados[mes - 1]}`,
        faturamento: valor
      });
    }

    // Calcula a variação percentual
    faturamentoUltimosMeses.reverse(); // do mais antigo pro mais atual

    for (let i = 0; i < faturamentoUltimosMeses.length; i++) {
      if (i === 0) {
        faturamentoUltimosMeses[i].variacao = null; // primeiro mês não tem comparação
      } else {
        const valorAtual = faturamentoUltimosMeses[i].faturamento;
        const valorAnterior = faturamentoUltimosMeses[i - 1].faturamento;

        let variacao = 0;
        if (valorAnterior > 0) {
          variacao = ((valorAtual - valorAnterior) / valorAnterior) * 100;
        } else if (valorAtual > 0) {
          variacao = 100;
        } else {
          variacao = 0;
        }

        faturamentoUltimosMeses[i].variacao = parseFloat(variacao.toFixed(2)); // % com 2 casas decimais
      }
    }

    res.json({
      faturamento: faturamentoUltimosMeses.map(({ chave, ...resto }) => resto) // remove a chave interna
    });

  } catch (err) {
    console.error('Erro ao calcular faturamento:', err);
    res.status(500).json({ error: 'Erro ao calcular faturamento mensal' });
  }
};

module.exports = {
  calcularFaturamentoMensal
};
