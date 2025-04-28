import "./Orçamentos.css"

function Orçamentos() {
    return ( 
        <div>
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
            <tr>
                <td><a href="/" className="aTdTabelaOrçamentos">Comoda Capri</a></td>
                <td>R$ 100,00</td>
                <td>1</td>
                <td>5% / R$ 5,00</td>
                <td>R$ 95,00</td>
                <td>10/10/2005</td>
            </tr>
        </tbody>
      </table>
    </div>
     );
}

export default Orçamentos;