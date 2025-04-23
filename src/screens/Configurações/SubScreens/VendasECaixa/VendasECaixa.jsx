import "./VendasECaixa.css";

function VendasECaixa() {
  return (
    <div id="VendasECaixa">
      <h3>🧾 Geral</h3>
      <div>
        <label className="labelVendasECaixa">
          <p>Permitir venda sem cliente cadastrado?</p>
          <input type="checkbox" />
        </label>

        <label className="labelVendasECaixa">
          <p>Abertura com senha?</p>
          <input type="checkbox" />
        </label>

        <label className="labelVendasECaixa">
          <p>Abertura de caixa obrigatória antes da venda?</p>
          <input type="checkbox" />
        </label>

        <label className="labelVendasECaixa">
          <p>Exigir fechamento de caixa por operador no final do turno?</p>
          <input type="checkbox" />
        </label>
      </div>
      <h3 style={{marginTop: '15px'}}>💸 Formas de Pagamento</h3>
      <div>
        <label className="labelVendasECaixa">
          <p>Formas de pagamento aceitas:</p>
          <input type="checkbox" />
        </label>

        <label className="labelVendasECaixa">
          <p>Parcelamento no cartão:</p>
          <input type="checkbox" />
        </label>

        <label className="labelVendasECaixa">
          <p>Limite de desconto:</p>
          <input type="checkbox" />
        </label>
      </div>
    </div>
  );
}

export default VendasECaixa;
