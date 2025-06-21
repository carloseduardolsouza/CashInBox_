const connection = require("../models/db");

const calcularFaturamentoMensal = async (req, res) => {
  try {
    // Consulta de vendas (exceto orçamentos)
    const vendas = await new Promise((resolve, reject) => {
      connection.all(
        `SELECT * FROM vendas WHERE status != 'orçamento'`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const faturamento = {};

    vendas.forEach((venda) => {
      const data = new Date(venda.data_venda);
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();
      const chave = `${ano}-${mes.toString().padStart(2, "0")}`;

      if (!faturamento[chave]) {
        faturamento[chave] = 0;
      }

      faturamento[chave] += venda.valor_total;
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

    // OUTRAS CONSULTAS

    // Crediários atrasados (parcelas com status vencido)
    const crediariosAtrasados = await new Promise((resolve, reject) => {
      connection.get(
        `SELECT COUNT(*) AS total FROM crediario_parcelas WHERE status = 'vencido'`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row.total);
        }
      );
    });

    // Quantidade de orçamentos
    const totalOrcamentos = await new Promise((resolve, reject) => {
      connection.get(
        `SELECT COUNT(*) AS total FROM vendas WHERE status = 'orçamento'`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row.total);
        }
      );
    });

    // Produtos com estoque mínimo atingido
    const produtosEstoqueMinimo = await new Promise((resolve, reject) => {
      connection.get(
        `SELECT COUNT(*) AS total FROM produtos WHERE estoque_atual <= estoque_minimo`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row.total);
        }
      );
    });

    // RESPOSTA FINAL
    res.json({
      faturamento: faturamentoUltimosMeses.map(({ chave, ...resto }) => resto),
      crediariosAtrasados,
      totalOrcamentos,
      produtosEstoqueMinimo,
    });
  } catch (err) {
    console.error("Erro ao calcular faturamento:", err);
    res.status(500).json({ error: "Erro ao calcular faturamento mensal" });
  }
};

module.exports = {
  calcularFaturamentoMensal,
};
