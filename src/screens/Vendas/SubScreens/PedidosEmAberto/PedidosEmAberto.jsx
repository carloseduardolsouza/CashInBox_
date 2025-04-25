import "./PedidosEmAberto.css";

function PedidosEmAberto() {
  return (
    <table className="Table">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Preço</th>
          <th>Quantidade</th>
          <th>Desconto</th>
          <th>Total</th>
          <th>Pagamento</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Comoda Capri</td>
          <td>R$ 100,00</td>
          <td>1</td>
          <td>5%</td>
          <td>R$ 95,00</td>
          <td>Pix</td>
          <td>
            <button id="AçãoButãoPedidosEmAberto">Ação</button>
          </td>
        </tr>
        {/*(loadingVendas && <Loading />) ||
          resultVendasPendentes.map((venda) => {
            return (
              <tr>
                <td>Comoda Capri</td>
                <td>R$ 100,00</td>
                <td>1</td>
                <td>5%</td>
                <td>R$ 95,00</td>
                <td>Pix</td>
                <td>
                  <button id="AçãoButãoPedidosEmAberto">Ação</button>
                </td>
              </tr>
            );
          })*/}
      </tbody>
    </table>
  );
}

export default PedidosEmAberto;
