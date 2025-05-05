import "./ResumoVisãoGeral.css";
import { useState } from "react";

function ResumoVisãoGeral() {
  const [abaAtiva, setAbaAtiva] = useState("Faturamento");
  return (
    <div>
      <h3>Resumo</h3>
      <input type="date" id="inptDateVisãoGeral"/>
      <div id="divButoãoGerarGrafico">
        <div
          className={`${
            abaAtiva === "Faturamento" ? "butoãoGerarGraficoAtivo" : "buttonGerarGráfico"
          }`}
          onClick={() => setAbaAtiva("Faturamento")}
        >
          <p>Faturamento</p>
          <strong>R$ 100,00</strong>
        </div>
        <div
          className={`${
            abaAtiva === "QuantVendas" ? "butoãoGerarGraficoAtivo" : "buttonGerarGráfico"
          }`}
          onClick={() => setAbaAtiva("QuantVendas")}
        >
          <p>Quant. de vendas</p>
          <strong>200</strong>
        </div>
        <div
          className={`${
            abaAtiva === "TicketMedio" ? "butoãoGerarGraficoAtivo" : "buttonGerarGráfico"
          }`}
          onClick={() => setAbaAtiva("TicketMedio")}
        >
          <p>Ticket Médio</p>
          <strong>R$ 100,00</strong>
        </div>
        <div
          className={`${
            abaAtiva === "LucroBruto" ? "butoãoGerarGraficoAtivo" : "buttonGerarGráfico"
          }`}
          onClick={() => {setAbaAtiva("LucroBruto")}}
        >
          <p>Lucro Bruto</p>
          <strong>R$ 100,00</strong>
        </div>
      </div>
    </div>
  );
}

export default ResumoVisãoGeral;
