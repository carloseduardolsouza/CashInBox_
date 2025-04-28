import "./VendasAReceber.css";
import {useState} from "react";

function VendasAReceber() {
  const [pageRecebido , setPageRecebido] = useState(false)
  return (
    <div>
      <table className="Table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Produto</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Carlos Eduardo Lourenço de Souza</td>
            <td><a href="/">Comoda Capri</a></td>
            <td>R$ 400,00</td>
            <td>Receber</td>
            <td>
              <button className="ButãoRecebidoVendas" onClick={() => setPageRecebido(true)}>Recebido</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VendasAReceber;
