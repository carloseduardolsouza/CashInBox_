import "./AdicionarSaldo.css";
import { useState } from "react";
import services from "../../../../../../services/services";

function AdicionarSaldo({fecharAba}) {
  const [value, setValue] = useState("");

  return (
    <div id="AdicionarSaldo">
      <button id="FecharAba" onClick={() => fecharAba(null)}>X</button>
      <h3>Adicionar dinheiro ao caixa</h3>
      <form>
        <label className="labelAdicionarSaldo">
          <span>Valor:</span>
          <input
            type="text"
            id="valor"
            value={value}
            onChange={(e) => {
              setValue(services.mascaraDeDinheroInput(e));
            }}
            placeholder="Digite o valor"
          />
        </label>

        <label className="labelAdicionarSaldo">
          <span>Descrição:</span>
          <textarea type="text" placeholder="Descrição..."/>
        </label>
        <button id="ButtonSalvarAdicionarSaldo">Salvar</button>
      </form>
    </div>
  );
}

export default AdicionarSaldo;
