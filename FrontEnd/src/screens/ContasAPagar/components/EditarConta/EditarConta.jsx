import "./EditarConta.css";

function EditarConta({fecharAba}) {
  return (
    <div className="blurModal">
      <div id="EditarConta">
        <h2>Editar Conta</h2>
        <form>
          <label>
            <strong>Numero do documento:</strong>
            <span>516515641 1515151 515151 5151</span>
          </label>

          <label>
            <strong>Valor:</strong>
            <input type="text" />
          </label>

          <label>
            <strong>Vencimento:</strong>
            <input type="date" />
          </label>

          <label>
            <strong>Referente a:</strong>
            <input type="text" />
          </label>

          <label>
            <strong>Valor Pago:</strong>
            <input type="text" />
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
