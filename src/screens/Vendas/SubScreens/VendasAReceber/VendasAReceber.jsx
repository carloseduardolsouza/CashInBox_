import "./VendasAReceber.css";

function VendasAReceber() {
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
            <td>Comoda Capri</td>
            <td>R$ 400,00</td>
            <td>Receber</td>
            <td>
              <button className="ButãoRecebidoVendas">Recebido</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VendasAReceber;
