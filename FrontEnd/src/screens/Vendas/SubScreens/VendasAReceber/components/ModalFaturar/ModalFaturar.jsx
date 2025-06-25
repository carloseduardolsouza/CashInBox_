import "./ModalFaturar.css";

import vendaFetch from "../../../../../../api/vendaFetch";
import { useState } from "react";

function ModalFaturar({ fechar, dados, atualizarVendas }) {
  const [valorPago, setValorPago] = useState(dados.valor_parcela);
  const [dataPagamento, setDataPagamento] = useState(
    new Date().toISOString().split("T")[0]
  );

  const faturarVendaCrediario = async (e) => {
    e.preventDefault();
    let corpoJson = {
      data: dataPagamento,
      valor_pago: valorPago,
    };

    const pago = vendaFetch
      .receberPagamentoParcela(dados.id, corpoJson)
      .then(() => {
        atualizarVendas();
        fechar(false);
      });
  };

  return (
    <div className="blurModal">
      <div id="ModalFaturar">
        <div className="headerModalFaturar">
          <h2>Receber Debito</h2>
          <button onClick={() => fechar(false)}>X</button>
        </div>
        <div>
          <p id="nomeClienteModalFaturar">
            <strong>Cliente: </strong>
            {dados.nome_cliente}
          </p>

          <form onSubmit={(e) => faturarVendaCrediario(e)}>
            <label className="labelInputs">
              <p>Valor:</p>
              <input
                type="number"
                value={valorPago}
                onChange={(e) => setValorPago(e.target.value)}
              />
            </label>
            <label className="labelInputs">
              <p>Data Pagamento:</p>
              <input
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
              />
            </label>

            <div id="divButtonsModalFaturar">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  fechar(null);
                }}
              >
                Cancelar
              </button>
              <button className="buttConfirmarModalFaturar" type="submit">
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalFaturar;
