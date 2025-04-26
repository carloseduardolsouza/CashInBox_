import "./vendas.css";
import { useState } from "react";

// Subtelas
import HistoricoVendas from "./SubScreens/HistoricoVendas/HistoricoVendas";
import PedidosEmAberto from "./SubScreens/PedidosEmAberto/PedidosEmAberto";
import VendasAReceber from "./SubScreens/VendasAReceber/VendasAReceber";
import Orçamentos from "./SubScreens/Orçamentos/Orçamentos";
import PedidosOnline from "./SubScreens/PedidosOnline/PedidosOnline";

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
      case "pedidosEmAberto":
        return <PedidosEmAberto />;
      case "vendasReceber":
        return <VendasAReceber />;
      case "orcamentos":
        return <Orçamentos />;
      case "pedidosOnline":
        return <PedidosOnline />;
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
        <a href="/pontoDeVenda" className="NovaVenda">
          Nova Venda
        </a>
        <a href="/novoOrçamento" className="NovoOrçamento">
          Novo Orçamento
        </a>
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
              abaAtiva === "pedidosEmAberto" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("pedidosEmAberto")}
          >
            Pedidos em Aberto
          </button>
          <button
            className={`ButãoVendasAbas ${
              abaAtiva === "vendasReceber" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("vendasReceber")}
          >
            Vendas a Receber
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
              abaAtiva === "pedidosOnline" ? "ativo" : ""
            }`}
            onClick={() => setAbaAtiva("pedidosOnline")}
          >
            Pedidos Online
          </button>
        </div>

        {renderConteudo()}
      </main>
    </div>
  );
}

export default Vendas;
