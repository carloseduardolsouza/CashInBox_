import "./Configurações.css";
import { useState, useEffect } from "react";

//telas
import ConfiguraçõesGerais from "./SubScreens/ConfiguraçõesGerais/ConfiguraçõesGerais";
import VendasECaixa from "./SubScreens/VendasECaixa/VendasECaixa";

function Configurações() {
  const [configuraçõesGerais, setConfiguraçõesGerais] = useState(true);
  const [vendasECaixa, setVendasECaixa] = useState(false);

  const alterarModoDeConfiguração = (modo) => {
    if (modo == "configuraçõesGerais") {
      setConfiguraçõesGerais(true);
      setVendasECaixa(false);
    }
    if (modo == "vendasECaixa") {
      setConfiguraçõesGerais(false);
      setVendasECaixa(true);
    }
  };
  return (
    <div id="Configurações">
      <h2>Configurações</h2>
      <div className="AreaVendasButtons">
        <button
          style={{ textDecoration: "underline #0295ff 3px" }}
          onClick={() => alterarModoDeConfiguração("configuraçõesGerais")}
        >
          🛠️ Configurações Gerais
        </button>
        <button
          style={{ textDecoration: "underline #0295ff 3px" }}
          onClick={() => alterarModoDeConfiguração("vendasECaixa")}
        >
          💵 Vendas e Caixa
        </button>
        <button style={{ textDecoration: "underline #0295ff 3px" }}>
          🧾 Notas Fiscais (NF-e / NFC-e)
        </button>
        <button style={{ textDecoration: "underline #0295ff 3px" }}>
          📦 Estoque
        </button>
        <button style={{ textDecoration: "underline #0295ff 3px" }}>
          🔒 Segurança
        </button>
        <button style={{ textDecoration: "underline #0295ff 3px" }}>
          🌐Integrações
        </button>
      </div>

      <main>
        {(configuraçõesGerais && <ConfiguraçõesGerais />) ||
          (vendasECaixa && <VendasECaixa />)}
      </main>
    </div>
  );
}

export default Configurações;
