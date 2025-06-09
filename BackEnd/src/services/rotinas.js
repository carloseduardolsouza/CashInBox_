const db = require("../models/db");
const dayjs = require("dayjs");

function verificarVencimentos() {
  const hoje = dayjs().format("YYYY-MM-DD");
  console.log("📅 Verificando vencimentos em:", hoje);

  db.all(
    "SELECT * FROM crediario_parcelas WHERE data_vencimento <= ? AND status = 'pendente'",
    [hoje],
    (err, rows) => {
      if (err) {
        console.error("❌ Erro ao buscar vencimentos:", err.message);
        return;
      }

      if (rows.length === 0) {
        console.log("✅ Nenhuma conta vencida hoje.");
        return;
      }

      rows.forEach((conta) => {
        console.log(`⚠️ Conta vencida: ${conta.descricao || "Sem descrição"} - R$${conta.valor}`);

        db.run(
          "UPDATE crediario_parcelas SET status = 'vencido' WHERE id = ?",
          [conta.id],
          (err) => {
            if (err) {
              console.error("❌ Erro ao atualizar status:", err.message);
            } else {
              console.log(`✔️ Conta ID ${conta.id} marcada como vencida.`);
            }
          }
        );
      });
    }
  );
}

module.exports = {
  verificarVencimentos,
};
