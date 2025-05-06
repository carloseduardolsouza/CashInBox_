import "./NovaConta.css";
import { useState } from "react";

function NovaConta({ fecharAba }) {
  const [boleto, setBoleto] = useState(false);

  const changeSelect = (event) => {
    if (event === "Boleto") {
      setBoleto(true);
    } else {
      setBoleto(false);
    }
  };

  return (
    <div className="blurModal">
      <div id="NovaConta">
        <h3>Nova Conta a Pagar</h3>
        <select
          id="selectTipoDeConta"
          onChange={(e) => changeSelect(e.target.value)}
        >
          <option value="Outro">Outro</option>
          <option value="Boleto">Boleto</option>
        </select>

        {(boleto && (
          <div>
            <div id="divBoletoTrue">
              <span>Digite o codigo do boleto</span>
              <input type="text" />
            </div>

            <div id="divButoesNovaConta">
              <button className="ButtonNovaConta SalvarNovaConta">
                Salvar
              </button>
              <button
                className="ButtonNovaConta CancelarNovaConta"
                onClick={() => fecharAba(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )) || (
          <div>
            <div className="divValorNDocumento">
              <div>
                <label htmlFor="valor">Valor:</label>
                <input id="valor" type="text" />
              </div>
              <div>
                <label htmlFor="NumDoDocumento">Num. do documento:</label>
                <input id="NumDoDocumento" type="number" />
              </div>
            </div>
            <div className="divVencimentoPago">
              <div>
                <label htmlFor="Vencimento">Vencimento</label>
                <input type="date" />
              </div>
              <div>
                <label htmlFor="ValorPago">Valor Pago:</label>
                <input type="text" id="ValorPago" />
              </div>
            </div>

            <div className="DivOsDemais">
              <label htmlFor="Referente">Referente a:</label>
              <input type="text" id="Referente" />
            </div>

            <div className="DivOsDemais">
              <label htmlFor="Fornecedor">Fornecedor:</label>
              <input type="text" id="Fornecedor" />
            </div>
            <div className="DivOsDemais">
              <label htmlFor="Observação">Observação:</label>
              <input type="text" id="Observação" />
            </div>

            <div>
              <div id="divRepetirPagamento">
                <div>
                  <input type="checkbox" />
                  <span>Repetir esse lançamento por</span>
                </div>
                <div>
                  <input type="number" />
                  <span>mêses</span>
                </div>
              </div>

              <table className="TableNovaConta">
                <thead>
                  <tr>
                    <th>Num. Doc</th>
                    <th>Vencimento</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1010</td>
                    <td>10/10/2005</td>
                    <td>R$ 200,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="divButoesNovaConta">
              <button className="ButtonNovaConta SalvarNovaConta">
                Salvar
              </button>
              <button
                className="ButtonNovaConta CancelarNovaConta"
                onClick={() => fecharAba(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NovaConta;
