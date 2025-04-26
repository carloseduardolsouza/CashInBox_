import "./Vendas.css";

function Vendas() {
  return (
    <table className="Table">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Desconto</th>
          <th>Total</th>
          <th>Codigo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Comoda Capri</td>
          <td>5% / R$ 10,00</td>
          <td>R$ 2.000,00</td>
          <td>0001</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Vendas;
