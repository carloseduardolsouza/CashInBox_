import "./Orçamentos.css";

//Icones
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";

function Orçamentos() {
  return (
    <div>
      <table className="Table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Produto</th>
            <th>total</th>
            <th>data</th>
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Carlos Eduardo Lourenço de Souza</td>
            <td><a href="/" className="aTdOrçamento">Comoda Capri</a></td>
            <td>R$ 2.000,00</td>
            <td>10/10/2005</td>
            <td>
              <button className="ButãoFaturarOrçamento ButãoTabelaOrçamento">
                <FaMoneyCheckDollar/>Faturar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Orçamentos;
