import "./VendasECaixa.css";
import { useState } from "react";

function VendasECaixa() {
  const [formasSelecionadas, setFormasSelecionadas] = useState([]);

  const opcoesPagamento = [
    "Dinheiro",
    "Cartão de débito",
    "Cartão de crédito",
    "Crediário Próprio",
    "Pix",
  ];

  const adicionarForma = (e) => {
    const valor = e.target.value;
    if (valor && !formasSelecionadas.includes(valor)) {
      setFormasSelecionadas([...formasSelecionadas, valor]);
    }
    e.target.value = ""; // reseta o select
  };

  const removerForma = (forma) => {
    setFormasSelecionadas(formasSelecionadas.filter((f) => f !== forma));
  };
  return (
    <div id="VendasECaixa">
      <div className="section">
        <h3>📦 Abertura e Caixa</h3>

        <label className="toggle">
          <span>Abertura com senha?</span>
          <input type="checkbox" />
        </label>

        <label className="toggle">
          <span>Abertura de caixa obrigatória antes da venda?</span>
          <input type="checkbox" />
        </label>

        <label className="toggle">
          <span>
            Exigir fechamento de caixa por operador no final do turno?
          </span>
          <input type="checkbox" />
        </label>
      </div>

      <div className="section">
        <h3>💰 Formas de Pagamento</h3>

        <label className="field">
          <span>Formas de pagamento aceitas:</span>
          <select onChange={adicionarForma} defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            {opcoesPagamento.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </label>

        <div className="lista-formas">
          {formasSelecionadas.map((forma, index) => (
            <div key={index} className="forma-item">
              {forma}
              <button type="button" onClick={() => removerForma(forma)}>
                ✖
              </button>
            </div>
          ))}
        </div>

        <label className="field">
          <span>Limite de desconto (%):</span>
          <input type="number" placeholder="Ex: 10" min={0}/>
        </label>

        <button className="salvarBtn">💾 Salvar Configurações</button>
      </div>
    </div>
  );
}

export default VendasECaixa;
