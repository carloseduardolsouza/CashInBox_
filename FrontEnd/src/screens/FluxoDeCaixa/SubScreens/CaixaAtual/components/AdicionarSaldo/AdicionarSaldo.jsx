import "./AdicionarSaldo.css";
import { useState , useContext } from "react";
import AppContext from "../../../../../../context/AppContext";

import caixaFetch from "../../../../../../api/caixaFetch";

function AdicionarSaldo({ fecharAba, idCaixa, atualizar }) {
  const {setErroApi} = useContext(AppContext)
  const [value, setValue] = useState("");
  const [descricao, setDescricao] = useState("");

  const adicionarSaldo = async (e) => {
    e.preventDefault();
    let dados = {
      descricao: descricao || "não definido",
      tipo: "entrada",
      valor: value,
    };

    await caixaFetch.novaMovimentacao(idCaixa, dados).then(() => {
      atualizar();
      fecharAba(null);
    }).catch(() => {
      setErroApi(true)
    });
  };

  return (
    <div className="blurModal">
      <div id="AdicionarSaldo">
        <button id="FecharAba" onClick={() => fecharAba(null)}>
          X
        </button>
        <h3>Adicionar dinheiro ao caixa</h3>
        <form onSubmit={(e) => adicionarSaldo(e)}>
          <label className="labelAdicionarSaldo">
            <span>Valor:</span>
            <input
              type="text"
              id="valor"
              value={value}
              required
              onChange={(e) => {
                setValue(e.target.value);
              }}
              placeholder="Digite o valor"
            />
          </label>

          <label className="labelAdicionarSaldo">
            <span>Descrição:</span>
            <textarea
              type="text"
              placeholder="Descrição..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </label>
          <button id="ButtonSalvarAdicionarSaldo" type="submit">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdicionarSaldo;
