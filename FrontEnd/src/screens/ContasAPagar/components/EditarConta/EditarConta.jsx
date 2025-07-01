import { useState, useContext } from "react";
import "./EditarConta.css";
import contasPagarFetch from "../../../../api/contasPagarFetch";
import AppContext from "../../../../context/AppContext";

function EditarConta({ fecharAba, dadosConta, atualizar }) {
  const [valor, setValor] = useState(dadosConta.valor_total);
  const [Vencimento, setVencimento] = useState(dadosConta.data_vencimento);
  const [referencia, setReferencia] = useState(dadosConta.categoria);
  const [nDocumento, setNDocumento] = useState(dadosConta.descricao);
  const [observacao, setObservacao] = useState(dadosConta.observacoes);

  const { adicionarAviso } = useContext(AppContext);

  const atualizarConta = async () => {
    let dados = {
      descricao: nDocumento,
      fornecedor: dadosConta.fornecedor,
      categoria: referencia,
      valor_total: valor,
      data_emissao: dadosConta.data_emissao,
      data_vencimento: Vencimento,
      forma_pagamento: dadosConta.forma_pagamento,
      parcelado: dadosConta.parcelado,
      observacoes: observacao,
      status: dadosConta.status,
      data_pagamento: dadosConta.data_pagamento,
    };

    await contasPagarFetch.editarConta(dados, dadosConta.id).then(() => {
      adicionarAviso("sucesso", "SUCESSO - Conta editada com sucesso");
      atualizar()
      fecharAba(null);
    });
  };
  return (
    <div className="blurModal">
      <div id="EditarConta">
        <h2>Editar Conta</h2>
        <form>
          <label>
            <strong>Numero do documento:</strong>
            <input
              value={nDocumento}
              onChange={(e) => setNDocumento(e.target.value)}
            />
          </label>

          <label>
            <strong>Valor:</strong>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </label>

          <label>
            <strong>Vencimento:</strong>
            <input
              type="date"
              value={Vencimento}
              onChange={(e) => setVencimento(e.target.value)}
            />
          </label>

          <label>
            <strong>Referente a:</strong>
            <input
              type="text"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
            />
          </label>

          <label>
            <strong>Observação:</strong>
            <input
              type="text"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </label>

          <div>
            <button onClick={() => atualizarConta()}>Salvar</button>
            <button onClick={() => fecharAba(null)}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarConta;
