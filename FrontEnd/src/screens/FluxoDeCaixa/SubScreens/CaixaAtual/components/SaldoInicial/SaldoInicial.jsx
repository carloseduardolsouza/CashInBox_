import "./SaldoInicial.css";
import caixaFetch from "../../../../../../api/caixaFetch";
import { useState, useContext } from "react";
import AppContext from "../../../../../../context/AppContext";

function SaldoInicial({ atualizar, fecharAba, statusCaixa }) {
  const { setErroApi } = useContext(AppContext);
  const [valorInicial, setValorInicial] = useState(0);

  const abrirCaixa = async (e) => {
    e.preventDefault();
    let dataCaixa = {
      valor_abertura: valorInicial || 0,
    };

    await caixaFetch
      .abrirCaixa(dataCaixa)
      .then(() => {
        statusCaixa("Aberto");
        atualizar();
        fecharAba(null);
      })
      .catch(() => setErroApi(true));
  };

  return (
    <div className="blurModal">
      <div id="SaldoInicial">
        <h2>Saldo Inicial do caixa</h2>
        <form
          id="formSaldoInicialFluxoCaixa"
          onSubmit={(e) => {
            abrirCaixa(e);
          }}
        >
          <label>
            <span>Saldo Inicial</span>
            <input
              type="number"
              placeholder="R$ 100,00"
              value={valorInicial}
              onChange={(e) => setValorInicial(e.target.value)}
            />
          </label>
          <div>
            <button type="submit">Concluir</button>
            <button
              type="button"
              onClick={() => fecharAba(null)}
              style={{ backgroundColor: "#333" }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaldoInicial;
