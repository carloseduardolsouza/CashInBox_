import "./Configurações.css";
import { useState } from "react";

//telas
import ConfiguraçõesGerais from "./SubScreens/ConfiguraçõesGerais/ConfiguraçõesGerais";
import VendasECaixa from "./SubScreens/VendasECaixa/VendasECaixa";

function Configurações() {
  const [abaAtiva, setAbaAtiva] = useState("configuraçõesGerais");

  const renderConteudo = () => {
    switch (abaAtiva) {
      case "configuraçõesGerais":
        return <ConfiguraçõesGerais />;
      case "VendasECaixa":
        return <VendasECaixa />;
      default:
        return null;
    }
  };
  return (
    <div id="Configurações">
      <h2>Configurações</h2>
      <div className="AreaVendasButtons">
        <button
          className={`bttConfiguraçõesAba ${
            abaAtiva === "configuraçõesGerais" ? "ativo" : ""
          }`}
          onClick={() => setAbaAtiva("configuraçõesGerais")}
        >
          🛠️ Configurações Gerais
        </button>
        <button
          className={`bttConfiguraçõesAba ${
            abaAtiva === "VendasECaixa" ? "ativo" : ""
          }`}
          onClick={() => setAbaAtiva("VendasECaixa")}
        >
          💵 Vendas e Caixa
        </button>
        <button
          className={`bttConfiguraçõesAba ${abaAtiva === "Notas" ? "ativo" : ""}`}
        >
          🧾 Notas Fiscais (NF-e / NFC-e)
        </button>
        <button
          className={`bttConfiguraçõesAba ${abaAtiva === "Estoque" ? "ativo" : ""}`}
        >
          📦 Estoque
        </button>
        <button
          className={`bttConfiguraçõesAba ${
            abaAtiva === "Segurança" ? "ativo" : ""
          }`}
        >
          🔒 Segurança
        </button>
        <button
          className={`bttConfiguraçõesAba ${
            abaAtiva === "Integrações" ? "ativo" : ""
          }`}
        >
          🤖Automação
        </button>
      </div>

      <div>{renderConteudo()}</div>
    </div>
  );
}

export default Configurações;
