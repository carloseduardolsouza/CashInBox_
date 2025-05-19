import "./SaldoInicial.css";

function SaldoInicial({ fecharAba, statusCaixa }) {
  const abrirCaixa = () => {
    statusCaixa("Aberto")
    fecharAba(null)
  };
  return (
    <div id="SaldoInicial">
      <h2>Saldo Inicial do caixa</h2>
      <form
        id="formSaldoInicialFluxoCaixa"
        onSubmit={(e) => {
          abrirCaixa();
        }}
      >
        <label>
          <span>Saldo Inicial</span>
          <input type="number" placeholder="R$ 100,00" />
        </label>
        <button type="submit">Concluir</button>
      </form>
    </div>
  );
}

export default SaldoInicial;
