import "./VendasECaixa.css";
import Select from "react-select";

function VendasECaixa() {
  return (
    <div id="VendasECaixa">
      <h3>🧾 Geral</h3>
      <div>

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
      <h3 style={{ marginTop: "15px" }}>💸 Formas de Pagamento</h3>
      <div>
        <label className="labelVendasECaixa">
          <p>Formas de pagamento aceitas:</p>
          <select>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de debito">Cartão de debito</option>
            <option value="Cartão de credito">Cartão de credito</option>
            <option value="Crediario Propio">Crediario Propio</option>
            <option value="Pix">Pix</option>
          </select>
          <div>
            <span></span>
          </div>
        </label>

        <label className="labelVendasECaixa">
          <p>Limite de desconto:</p>
          <input type="number" />
        </label>
      </div>
    </div>
  );
}

export default VendasECaixa;
