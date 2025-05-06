import "./FaturarVenda.css";

//icones
import { IoSearchSharp } from "react-icons/io5";


function FaturarVenda({ fechar }) {
  return (
    <div className="blurModal">
      <div id="FaturarVenda">
        <button id="ButtonFecharAbaFaturarVenda" onClick={() => fechar(false)}>
          X
        </button>
        <div id="FaturarVendaPart1">
          <div id="FaturarVendaPreços">
            <div>
              <p>Total da venda:</p>
              <input type="number" placeholder="00,00" />
            </div>
            <div>
              <p style={{ marginRight: "50px" }}>Desconto:</p>
              <input
                type="number"
                placeholder="00,00"
                className="realDesconto"
              />
              <input
                type="number"
                className="porcentagemDesconto"
                placeholder="5%"
              />
            </div>
            <div>
              <p>Acrescimo/Frete:</p>
              <input
                type="number"
                placeholder="00,00"
                className="realDesconto"
              />
              <input
                type="number"
                className="porcentagemDesconto"
                placeholder="5%"
              />
            </div>
            <div>
              <p>Total a Pagar:</p>
              <input type="number" value={1199.9} />
            </div>
            <div>
              <p>itens</p>
            </div>
          </div>
          <div id="FaturarVendaDetalhesCliente">
            <div>
              <div className="ItenSearch">
                <p>Cliente:</p>
                <div style={{ display: "flex" }}>
                  <input type="text" placeholder="Fulano de tal" />
                  <button style={{ marginLeft: "10px" }}>
                    <IoSearchSharp />
                  </button>
                </div>
              </div>
              <div className="ItenSearch">
                <p>Vendedor:</p>
                <div style={{ display: "flex" }}>
                  <input type="text" placeholder="Fulano de tal" />
                  <button style={{ marginLeft: "10px" }}>
                    <IoSearchSharp />
                  </button>
                </div>
              </div>
              <div id="FaturarVendaFormaDePagamento">
                <p>Forma de pagamento:</p>
                <select>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de credito">Cartão de credito</option>
                  <option value="Cartão de debito">Cartão de debito</option>
                </select>
                <input type="number" />
                <button>ok</button>
              </div>
            </div>
            <div>
              <table className="Table">
                <thead>
                  <tr>
                    <th>Forma de pagamento</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dinheiro</td>
                    <td>R$ 100,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div id="FaturarVendaFaltaPagar">
              <label>
                <p>Falta pagar:</p>
                <input type="text" />
              </label>
              <label>
                <p>Troco:</p>
                <input type="text" />
              </label>
            </div>
          </div>
          <div></div>
        </div>
        <div id="areaButtons">
          <div>
            <button onClick={() => fechar(false)}>(ESC) - Sair</button>
            <button>NFC-e Online</button>
            <button>NFC-e Off-Line</button>
          </div>
          <div>
            <button>Lançamento NF de bloco</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaturarVenda;
