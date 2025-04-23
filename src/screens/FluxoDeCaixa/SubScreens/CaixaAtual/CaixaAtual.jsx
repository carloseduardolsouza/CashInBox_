import "./CaixaAtual.css"

function CaixaAtual() {
  return (
    <div id="CaixaAtual">
      <div className="InfoDetalhasdasCaixaAtual">
        <div className="Resumodecaixa">
          <h3>Resumo de Caixa</h3>
          <p>
            <strong>Saldo Inicial:</strong> {"R$ 200,00"}
          </p>
          <p>
            <strong>Total de caixa:</strong> {"-R$ 100,00"}
          </p>
          <p> ---------------------------------------------</p>
          <h4>saldo final : {"R$ 100,00"}</h4>
        </div>
      </div>

      <div className="InfoCaixaAtual">
        <h3>Movimentações</h3>
        <div id="sectionrolavel">

        </div>

        <div className="FooterCaixaAtual">
          <strong>Saldo Final</strong>
          <h1>{"R$ 200,00"}</h1>
          <button id="ButtonCaixa">{"Fechar Caixa"}</button>
        </div>
      </div>
    </div>
  );
}

export default CaixaAtual;
