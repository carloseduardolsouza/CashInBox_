import { useState, useContext } from "react";
import "./PagarConta.css";
import AppContext from "../../../../context/AppContext";

import contasPagarFetch from "../../../../api/contasPagarFetch";

function PagarConta({ atualizar, fecharAba, dadosConta }) {
  const [valor, setValor] = useState(dadosConta.valor_total);
  const [pagamentoDate, setPagamentoDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { adicionarAviso } = useContext(AppContext);

  const pagarConta = async (e) => {
    e.preventDefault();

    await contasPagarFetch.pagarConta(dadosConta.id, pagamentoDate).then(() => {
      adicionarAviso("sucesso" , "SUCESSO - Conta paga com sucesso")
      atualizar();
      fecharAba(null);
    });
  };

  return (
    <div className="blurModal">
      <form id="PagarConta" onSubmit={(e) => pagarConta(e)}>
        <h2>Pagar conta</h2>
        <p>
          <strong>Referente a: </strong>
          {dadosConta.categoria}
        </p>
        <div>
          <div className="labelPagarConta">
            <p>Valor pago:</p>
            <input type="number" value={valor} />
          </div>

          <div className="labelPagarConta">
            <p>Data pagamento:</p>
            <input type="date" value={pagamentoDate} />
          </div>
        </div>

        <div id="divButtonPagarConta">
          <button type="button" onClick={() => fecharAba(null)}>
            Cancelar
          </button>
          <button type="submit" id="buttonPagar">
            Pagar
          </button>
        </div>
      </form>
    </div>
  );
}

export default PagarConta;
