import "./DetalhesDaVenda.css";

function DetalhesDaVenda() {
  return (
    <div id="DetalhesDaVenda">
      <div id="DetalhesDaVendaDisplay">
        <div id="DetalhesDaVendaDisplay1">
          <h2>Detalhes da Venda</h2>
          <div id="DivisãoClienteDetalhesDaVenda">
            <div>
              <div id="ImgClienteDetalhesDaVenda"></div>
            </div>

            <div>
              <p>
                <strong>Nome: </strong>Carlos Eduardo Lourenço de Souza
              </p>
              <p>
                <strong>Numero: </strong>(62) 9 9336-2090
              </p>
              <p>
                <strong>CPF: </strong>712.478.141-81
              </p>
              <p>
                <strong>Endereço: </strong>R.2 , Qd.2 , Lt.13 , Jd. Petrópolis
              </p>
            </div>
          </div>

          <div>
            <table className="Table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor</th>
                  <th>Desconto</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Comoda Capri</td>
                  <td>1</td>
                  <td>R$ 100,00</td>
                  <td>5% / R$ 5,00</td>
                  <td>R$ 95,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="DetalhesDaVendaDisplay2">
          <div id="DetalhesDaVendaDisplay2Pt1">
            <h2>R$ 1.250,00</h2>
            <a>Venda #0001 - 25 Abr 2024</a>
          </div>

          <div id="DetalhesDaVendaDisplay2Pt2">
            <p>
              <strong>Pagamento: </strong>Dinheiro
            </p>
            <p>
              <strong>Status: </strong>Concluida
            </p>
            <p>
              <strong>Quantidade de itens: </strong>2
            </p>
            <p>
              <strong>Vendedor: </strong>Carlos Eduardo
            </p>
            <p>
              <strong>Status: </strong>Concluida
            </p>
          </div>

          <div id="DetalhesDaVendaDisplay2Pt3">
            <p id="CancelarVendaDetalhesDaVenda">Cancelar Venda</p>
            <div>
              <button className="ButãoEditarDetalhesDaVenda ButãoDetalhesDaVenda">
                Editar
              </button>
              <button className="ButãoNotasDetalhesDaVenda ButãoDetalhesDaVenda">
                (NF-e / NFC-e)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesDaVenda;
