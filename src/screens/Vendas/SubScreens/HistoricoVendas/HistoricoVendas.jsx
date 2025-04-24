import "./HistoricoVendas.css";

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
      <table className="Table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Desconto</th>
            <th>Total</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {/*(loadingVendas && <Loading />) ||
            resultVendas.map((vendas) => {
              return (
                <tr>
                  <td>Comoda Capri</td>
                  <td>R$ 100,00</td>
                  <td>1</td>
                  <td>5%</td>
                  <td>R$ 95,00</td>
                  <td>10/10/2005</td>
                </tr>
              );
            })*/}
        </tbody>
      </table>
    </div>
  );
}

export default HistoricoVendas;
