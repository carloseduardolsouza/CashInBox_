import "./Configurações.css";
import { useState } from "react";

//telas
import ConfiguraçõesGerais from "./SubScreens/ConfiguraçõesGerais/ConfiguraçõesGerais";
import VendasECaixa from "./SubScreens/VendasECaixa/VendasECaixa";

import AutomacaoWhats from "./SubScreens/AutomacaoWhats/AutomacaoWhats"

function Configurações() {
  const [abaAtiva, setAbaAtiva] = useState("configuraçõesGerais");

  const renderConteudo = () => {
    switch (abaAtiva) {
      case "configuraçõesGerais":
        return <ConfiguraçõesGerais />;
      case "VendasECaixa":
        return <VendasECaixa />;
      case "AutomacaoWhats":
        return <AutomacaoWhats />;
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
          className={`bttConfiguraçõesAba ${
            abaAtiva === "Segurança" ? "ativo" : ""
          }`}
          onClick={() => setAbaAtiva("Segurança")}
        >
          🔒 Segurança
        </button>
        <button
          className={`bttConfiguraçõesAba ${
            abaAtiva === "AutomacaoWhats" ? "ativo" : ""
          }`}
          onClick={() => setAbaAtiva("AutomacaoWhats")}
        >
          🤖Automação
        </button>
      </div>

      <div>{renderConteudo()}</div>
    </div>
  );
}

export default Configurações;
