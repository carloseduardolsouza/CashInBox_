import "./ResumoVisãoGeral.css";
import { useEffect, useState } from "react";

//api
import relatorioFetch from "../../../../api/relatorioFetch";

// Componentes
import MetricCard from "../../components/MetricCard/MetricCard";
import GoalProgressBar from "../../components/GoalProgressBar/GoalProgressBar";
import LineChart from "../../components/LineChart/LineChart";
import DateFilter from "../../components/DateFilter/DateFilter";

function ResumoVisãoGeral() {
  const [metricaAtiva, setMetricaAtiva] = useState("Faturamento");
  const [formData, setFormData] = useState({
    faturamentoMes: null,
    ticketMedio: null,
    variacaoFaturamento: null,
    variacaoTicketMedio: null,
    variacaoVendas: null,
    vendasMes: null,
  });
  const [dataInicial, setDataInicial] = useState(() => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    return primeiroDia.toISOString().split("T")[0];
  });
  const [dataFinal, setDataFinal] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().split("T")[0];
  });

  // Dados mock - em um app real, viriam de uma API
  const dadosResumo = {
    faturamento: { valor: 125000, trend: 12.5, meta: 150000 },
    quantVendas: { valor: 342, trend: -5.2, meta: 400 },
    ticketMedio: { valor: 365.5, trend: 18.3, meta: 300 },
    lucroBruto: { valor: 45000, trend: 8.7, meta: 50000 },
  };

  const dadosGrafico = {
    Faturamento: [
      { nome: "Jan", valor: 65000 },
      { nome: "Fev", valor: 78000 },
      { nome: "Mar", valor: 52000 },
      { nome: "Abr", valor: 89000 },
      { nome: "Mai", valor: 95000 },
      { nome: "Jun", valor: 125000 },
    ],
    QuantVendas: [
      { nome: "Jan", valor: 285 },
      { nome: "Fev", valor: 312 },
      { nome: "Mar", valor: 198 },
      { nome: "Abr", valor: 356 },
      { nome: "Mai", valor: 398 },
      { nome: "Jun", valor: 342 },
    ],
    TicketMedio: [
      { nome: "Jan", valor: 228 },
      { nome: "Fev", valor: 250 },
      { nome: "Mar", valor: 262 },
      { nome: "Abr", valor: 250 },
      { nome: "Mai", valor: 239 },
      { nome: "Jun", valor: 365 },
    ],
    LucroBruto: [
      { nome: "Jan", valor: 32500 },
      { nome: "Fev", valor: 39000 },
      { nome: "Mar", valor: 26000 },
      { nome: "Abr", valor: 44500 },
      { nome: "Mai", valor: 47500 },
      { nome: "Jun", valor: 45000 },
    ],
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleFilterApply = () => {
    // Aqui você implementaria a lógica para aplicar os filtros
    console.log("Aplicando filtros:", { dataInicial, dataFinal });
  };

  useEffect(() => {
    relatorioFetch.buscarResumoRelatorios().then((response) => {
      setFormData({
        faturamentoMes: response.faturamentoMes,
        ticketMedio: response.ticketMedio,
        variacaoFaturamento: response.variacaoFaturamento,
        variacaoTicketMedio: response.variacaoTicketMedio,
        variacaoVendas: response.variacaoVendas,
        vendasMes: response.vendasMes,
      });
    });
  }, []);

  return (
    <div className="resumo-container">
      <h3>Resumo</h3>

      <DateFilter
        dataInicial={dataInicial}
        dataFinal={dataFinal}
        onDataInicialChange={setDataInicial}
        onDataFinalChange={setDataFinal}
        onApply={handleFilterApply}
      />

      <div className="metrics-grid">
        <MetricCard
          title="Faturamento"
          value={formatCurrency(formData.faturamentoMes)}
          trend={formData.variacaoFaturamento}
          isActive={metricaAtiva === "Faturamento"}
          onClick={() => setMetricaAtiva("Faturamento")}
          icon="💰"
        />
        <MetricCard
          title="Quant. de Vendas"
          value={formData.vendasMes}
          trend={formData.variacaoVendas}
          isActive={metricaAtiva === "QuantVendas"}
          onClick={() => setMetricaAtiva("QuantVendas")}
          icon="📊"
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(formData.ticketMedio)}
          trend={formData.variacaoTicketMedio}
          isActive={metricaAtiva === "TicketMedio"}
          onClick={() => setMetricaAtiva("TicketMedio")}
          icon="🎯"
        />
        <MetricCard
          title="Lucro Bruto"
          value={formatCurrency(dadosResumo.lucroBruto.valor)}
          trend={dadosResumo.lucroBruto.trend}
          isActive={metricaAtiva === "LucroBruto"}
          onClick={() => setMetricaAtiva("LucroBruto")}
          icon="📈"
        />
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <LineChart
            title={`Evolução - ${metricaAtiva
              .replace(/([A-Z])/g, " $1")
              .trim()}`}
            data={dadosGrafico[metricaAtiva]}
            dataKey="valor"
            isMonetary={
              metricaAtiva.includes("amento") ||
              metricaAtiva.includes("Lucro") ||
              metricaAtiva.includes("Ticket")
            }
          />
        </div>

        <div className="goals-section">
          <h4>Metas do Período</h4>
          <div className="goals-grid">
            <GoalProgressBar
              current={dadosResumo.faturamento.valor}
              goal={dadosResumo.faturamento.meta}
              label="Faturamento"
              color="#0295ff"
            />
            <GoalProgressBar
              current={dadosResumo.quantVendas.valor}
              goal={dadosResumo.quantVendas.meta}
              label="Vendas"
              color="#10B981"
            />
            <GoalProgressBar
              current={dadosResumo.ticketMedio.valor}
              goal={dadosResumo.ticketMedio.meta}
              label="Ticket Médio"
              color="#F59E0B"
            />
            <GoalProgressBar
              current={dadosResumo.lucroBruto.valor}
              goal={dadosResumo.lucroBruto.meta}
              label="Lucro Bruto"
              color="#8B5CF6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumoVisãoGeral;
