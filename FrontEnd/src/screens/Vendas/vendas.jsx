import "./vendas.css";
import { useState } from "react";
import { Link } from "react-router-dom";

import { FaComputer } from "react-icons/fa6";

// Subtelas
import HistoricoVendas from "./SubScreens/HistoricoVendas/HistoricoVendas";
import Orçamentos from "./SubScreens/Orçamentos/Orçamentos";
import VendasAReceber from "./SubScreens/VendasAReceber/VendasAReceber";

function Vendas() {
  const Data = new Date();
  const log = `${Data.getUTCDate()}/${
    Data.getUTCMonth() + 1
  }/${Data.getUTCFullYear()}`;

  const [abaAtiva, setAbaAtiva] = useState("historico");

  // Função para renderizar a tela correspondente
  const renderConteudo = () => {
    switch (abaAtiva) {
      case "historico":
        return <HistoricoVendas />;
      case "orcamentos":
        return <Orçamentos />;
      case "vendasReceber":
        return <VendasAReceber/>
      default:
        return null;
    }
  };

  return (
    <div id="VENDAS">
      <header className="HeaderVendas">
        <h2 id="TitleVendas">Vendas</h2>
        <p>{log}</p>
      </header>

      <article className="ArticleVendas">
        <Link to={"/pontoDeVenda"} className="NovaVenda">
          <FaComputer /> Nova Venda
        </Link>
      </article>

      <main>
        <div className="AreaVendasButtons">
          <button
            className={`ButãoVendasAbas ${
              abaAtiva === "historico" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("historico")}
          >
            Histórico
          </button>
          <button
            className={`ButãoVendasAbas ${
              abaAtiva === "orcamentos" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("orcamentos")}
          >
            Orçamentos
          </button>

          <button
            className={`ButãoVendasAbas ${
              abaAtiva === "vendasReceber" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("vendasReceber")}
          >
            Vendas a receber
          </button>
        </div>

        {renderConteudo()}
      </main>
    </div>
  );
}

export default Vendas;
