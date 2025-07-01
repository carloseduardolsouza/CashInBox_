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

    const corpoJson = {
      data: dataPagamento,
      valor_pago: valorPago,
    };

    await vendaFetch.receberPagamentoParcela(dados.id, corpoJson);
    atualizarVendas();
    fechar(false);
  };

  return (
    <div className="blurModal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Receber Débito</h2>
          <button className="close-button" onClick={() => fechar(false)}>
            ✕
          </button>
        </div>

        <p className="cliente-info">
          <strong>Cliente:</strong> {dados.nome_cliente}
        </p>

        <form onSubmit={faturarVendaCrediario}>
          <label className="input-group">
            <span>Valor:</span>
            <input
              type="number"
              value={valorPago}
              onChange={(e) => setValorPago(e.target.value)}
              required
            />
          </label>

          <label className="input-group">
            <span>Data Pagamento:</span>
            <input
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              required
            />
          </label>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => fechar(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-confirmar">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalFaturar;
