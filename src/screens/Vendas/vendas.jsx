import "./vendas.css";
import { useState, useEffect } from "react";

//SubTelas
import HistoricoVendas from "./SubScreens/HistoricoVendas/HistoricoVendas";
import PedidosEmAberto from "./SubScreens/PedidosEmAberto/PedidosEmAberto";
import VendasAReceber from "./SubScreens/VendasAReceber/VendasAReceber";

//Componentes
//import ItensTable from "../../components/itensTableVendas/itensTableVendas"
//import ItensTablePendentes from "../../components/itensTableVendasPendentes/itensTableVendasOpen"

//import fetchapi from "../../api/fetchapi";
//import Loading from "../../components/AçãoRealizada/AçãoRealizada"

function Vendas() {
  const Data = new Date();
  const log = `${Data.getUTCDate()}/${
    Data.getUTCMonth() + 1
  }/${Data.getUTCFullYear()}`;

  const [históricoAberto, setHistóricoAberto] = useState(true);
  const [vendasReceber, setVendasReceber] = useState(false);

  const [resultadosVendas, setResultadosVendas] = useState([]);
  const [resultadosVendasPendentes, setResultadosVendasPendentes] = useState(
    []
  );
  const [loadingVendas, setloadingVendas] = useState(true);

  /*useEffect(() => {
    fetchapi.ProcurarVendas().then((response) => {
      setResultVendas(response);
      setloadingVendas(false);
    });
  }, []);*/

  /*useEffect(() => {
    fetchapi.procurarVendaPendente().then((response) => {
      setResultVendasPendentes(response);
    });
  }, []);*/

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
      </article>
      <main>
        <div className="AreaVendasButtons">
          <button
            style={{ textDecoration: "underline #0295ff 3px" }}
            onClick={() => {
              setHistóricoAberto(true);
              setVendasReceber(false);
            }}
          >
            Histórico
          </button>
          <button
            style={{ textDecoration: "underline #0295ff 3px" }}
            onClick={() => {
              setHistóricoAberto(false);
              setVendasReceber(false);
            }}
          >
            Pedidos em aberto
          </button>
          <button
            style={{ textDecoration: "underline #0295ff 3px" }}
            onClick={() => {
              setHistóricoAberto(false);
              setVendasReceber(true);
            }}
          >
            Vendas Receber
          </button>
        </div>
        {(históricoAberto && <HistoricoVendas />) ||
          (vendasReceber && <VendasAReceber />) || <PedidosEmAberto />}
      </main>
    </div>
  );
}

export default Vendas;
