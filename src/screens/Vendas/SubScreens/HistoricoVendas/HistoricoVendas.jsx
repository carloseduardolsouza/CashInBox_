import './HistoricoVendas.css'

import { FaFilter } from "react-icons/fa";

function HistoricoVendas() {
  return (
    <div>
      <form>
        <input type="date" className="FilterDateVendas" />
        <button className="FilterICONDateVendas">
          <FaFilter />
        </button>
      </form>
      <table className="TableVendas">
        <div className="TableHeader">
          <p className="itemTabelTitle">Produto</p>
          <p className="itemTabelTitle PreçoVendasScreenTable">Preço</p>
          <p className="itemTabelTitle QuantidadeVendasScreenTable">
            Quantidade
          </p>
          <p className="itemTabelTitle DescontoVendasScreenTable">Desconto</p>
          <p className="itemTabelTitle TotalVendasScreenTable">Total</p>
          <p className="itemTabelTitle Data">Data</p>
        </div>
        {/*(loadingVendas && <Loading />) ||
          resultVendas.map((vendas) => <ItensTable data={vendas} />)*/}
      </table>
    </div>
  );
}

export default HistoricoVendas;
