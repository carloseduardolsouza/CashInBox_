import { useState } from "react";
import "./Relatorios.css";

function Relatorios() {
  const [abaAtiva, setAbaAtiva] = useState("Resumo");

  const handleClick = (nomeAba) => {
    setAbaAtiva(nomeAba);
  };

  const renderItem = (label) => (
    <p
      className={`p ${abaAtiva === label ? "ativoRelatorios" : ""}`}
      onClick={() => handleClick(label)}
    >
      {label}
    </p>
  );

  return (
    <div id="Relatorios">
      <h2>Relatórios</h2>
      <nav id="menuRelatorios">
        <div className="divMenuRelatorios">
          <strong>Visão Geral</strong>
          {renderItem("Resumo")}
        </div>

        <div className="divMenuRelatorios">
          <strong>Lucratividade</strong>
          {renderItem("Receita/Despesas")}
          {renderItem("por produto vendido")}
        </div>

        <div className="divMenuRelatorios">
          <strong>Fornecedores</strong>
          {renderItem("por produto")}
          {renderItem("vendas analítico")}
        </div>

        <div className="divMenuRelatorios">
          <strong>Vendas</strong>
          {renderItem("meios de pagamento")}
          {renderItem("comissão por vendedor")}
          {renderItem("horário de pico")}
          {renderItem("categoria de produto")}
          {renderItem("vendedor")}
          {renderItem("produto")}
          {renderItem("cliente e categoria")}
          {renderItem("vendas e retenção")}
          {renderItem("produtos monofásico")}
        </div>

        <div className="divMenuRelatorios">
          <strong>Estoque</strong>
          {renderItem("uso e consumo interno")}
          {renderItem("recomendação de estoque")}
        </div>

        <div className="divMenuRelatorios">
          <strong>Clientes</strong>
          {renderItem("Ranking de vendas")}
        </div>

        <div className="divMenuRelatorios">
          <strong>Contas a pagar</strong>
          {renderItem("A vencer")}
          {renderItem("A pagar")}
        </div>

        <div className="divMenuRelatorios">
          <strong>Entregas</strong>
          {renderItem("por entregador")}
          {renderItem("por transportadora")}
        </div>
      </nav>
    </div>
  );
}

export default Relatorios;
