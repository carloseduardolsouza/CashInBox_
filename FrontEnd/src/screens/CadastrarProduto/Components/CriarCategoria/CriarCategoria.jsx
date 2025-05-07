import "./CriarCategoria.css";

function CriarCategoria({fechar}) {
  return (
    <div className="blurModal">
      <form id="formCriarCategoria">
        <h2>Criar Categoria</h2>
        <div>
          <h3>Informações da Categoria</h3>
          <label>
            <span>nome:</span>
            <input type="text" />
          </label>
        </div>
        <nav>
          <button className="bttCancelarCriarCategoria"
          onClick={(e) => {
            e.preventDefault()
            fechar(null)
          }}
          >Cancelar</button>
          <button className="bttriarCriarCategoria">Criar Categoria</button>
        </nav>
      </form>
    </div>
  );
}

export default CriarCategoria;
