import "./CaixasAnteriores.css";

function CaixasAnteriores() {
  return (
    <div id="CaixasAnteriores">
      <table className="Table">
        <thead>
          <tr>
            <th>Caixa</th>
            <th>Abertura</th>
            <th>Fechamento</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10/10/2005</td>
            <td>R$ 200,00</td>
            <td>R$ 400,00</td>
            <button>Detalhes</button>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CaixasAnteriores;
