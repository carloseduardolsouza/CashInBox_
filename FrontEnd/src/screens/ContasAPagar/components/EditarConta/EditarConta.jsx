import { useState } from "react";
import "./EditarConta.css";

function EditarConta({fecharAba , dadosConta}) {
  const [valor , setValor] = useState(dadosConta.valor_total)
  const [Vencimento , setVencimento] = useState(dadosConta.data_vencimento)
  const [referencia , setReferencia] = useState(dadosConta.categoria)
  console.log(dadosConta)
  return (
    <div className="blurModal">
      <div id="EditarConta">
        <h2>Editar Conta</h2>
        <form>
          <label>
            <strong>Numero do documento:</strong>
            <span>{dadosConta.descricao}</span>
          </label>

          <label>
            <strong>Valor:</strong>
            <input type="text" value={valor}/>
          </label>

          <label>
            <strong>Vencimento:</strong>
            <input type="date" value={Vencimento}/>
          </label>

          <label>
            <strong>Referente a:</strong>
            <input type="text" value={referencia}/>
          </label>

          <div>
            <button>Salvar</button>
            <button onClick={() => fecharAba(null)}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarConta;
