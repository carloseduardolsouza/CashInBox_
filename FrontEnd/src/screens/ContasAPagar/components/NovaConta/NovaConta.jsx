import "./NovaConta.css";
import { useState, useContext } from "react";
import contasPagarFetch from "../../../../api/contasPagarFetch";
import AppContext from "../../../../context/AppContext";

function NovaConta({ fecharAba, atualizar }) {
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [emissão, setEmissão] = useState("");
  const [formPagamento, setFormPagamento] = useState("Boleto");
  const [numDoc, setNumDoc] = useState("");
  const [referencia, setReferencia] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [obs, setObs] = useState("");

  const { setErroApi } = useContext(AppContext);

  const lançarConta = async (e) => {
    e.preventDefault();
    let dados = {
      descricao: numDoc,
      fornecedor: fornecedor,
      categoria: referencia,
      valor_total: valor,
      data_emissao: emissão,
      data_vencimento: vencimento,
      forma_pagamento: formPagamento,
      parcelado: false,
      observacoes: obs,
      status: "pendente",
      data_pagamento: null,
    };

    await contasPagarFetch
      .novaConta(dados)
      .then(() => {
        fecharAba(null);
        atualizar();
      })
      .catch(() => setErroApi(true));
  };

  return (
    <div className="blurModal">
      <form id="NovaConta" onSubmit={(e) => lançarConta(e)}>
        <h3>Nova Conta a Pagar</h3>
        <div>
          <div className="divValorNDocumento">
            <div>
              <label htmlFor="valor">Valor:</label>
              <input
                required
                id="valor"
                type="number"
                min={1}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="Vencimento">Vencimento</label>
              <input
                required
                type="date"
                onChange={(e) => setVencimento(e.target.value)}
              />
            </div>
          </div>

          <div className="divValorNDocumento">
            <div>
              <label htmlFor="formaPagamento">Forma de pagamento:</label>
              <select
                id="formaPagamento"
                name="formaPagamento"
                onChange={(e) => setFormPagamento(e.target.value)}
                value={formPagamento}
              >
                <option value="Boleto">Boleto</option>
                <option value="Carne">Carnê</option>
                <option value="Conta">Conta</option>
                <option value="Folha de pagamento">Folha de pagamento</option>
              </select>
            </div>

            <div>
              <label htmlFor="Vencimento">Emitido em</label>
              <input
                required
                type="date"
                onChange={(e) => setEmissão(e.target.value)}
              />
            </div>
          </div>

          <div className="divVencimentoPago">
            <div className="DivOsDemais">
              <label htmlFor="NumDoDocumento">Num. do documento:</label>
              <input
                required
                id="NumDoDocumento"
                type="number"
                onChange={(e) => setNumDoc(e.target.value)}
              />
            </div>
          </div>

          <div className="DivOsDemais">
            <label htmlFor="Referente">Referente a:</label>
            <input
              required
              type="text"
              id="Referente"
              onChange={(e) => setReferencia(e.target.value)}
            />
          </div>

          <div className="DivOsDemais">
            <label htmlFor="Observação">Observação:</label>
            <input
              type="text"
              id="Observação"
              onChange={(e) => setObs(e.target.value)}
            />
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
            <button className="ButtonNovaConta SalvarNovaConta" type="submit">
              Salvar
            </button>
            <button
              className="ButtonNovaConta CancelarNovaConta"
              type="button"
              onClick={() => fecharAba(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NovaConta;
