import "./FecharCaixa.css";
import fetchapi from "../../../../../../api/fetchapi";
import { useState, useContext } from "react";
import AppContext from "../../../../../../context/AppContext";

function FecharCaixa({ atualizar, fecharAba, statusCaixa , id}) {
  const { setErroApi } = useContext(AppContext);
  const [valorFinal, setValorFinal] = useState(0);

  const fecharCaixa = async (e) => {
    e.preventDefault();
    let dataCaixa = {
      valor_fechamento: valorFinal || 0,
    };

    await fetchapi
      .FecharCaixa(dataCaixa , id)
      .then(() => {
        statusCaixa("Fechado");
        atualizar();
        fecharAba(null);
      })
      .catch(() => setErroApi(true));
  };

  return (
    <div id="SaldoInicial">
      <h2>Saldo Final do caixa</h2>
      <form
        id="formSaldoInicialFluxoCaixa"
        onSubmit={(e) => {
          fecharCaixa(e);
        }}
      >
        <label>
          <span>Saldo Final</span>
          <input
            type="number"
            placeholder="R$ 100,00"
            value={valorFinal}
            onChange={(e) => setValorFinal(e.target.value)}
          />
        </label>
        <button type="submit">Concluir</button>
      </form>
    </div>
  );
}

export default FecharCaixa;
