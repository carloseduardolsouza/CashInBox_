import "./CriarCategoria.css";
import { useState , useContext } from "react";
import AppContext from "../../../../context/AppContext"

//conexão com a api
import fetchapi from "../../../../api/fetchapi";

function CriarCategoria({ fechar }) {
  const [nomeCategoria, setNomeCategoria] = useState("");

  const {setErroApi} = useContext(AppContext)

  const criarCategoria = (e) => {
    const dados = {
      nome: nomeCategoria,
    };
    e.preventDefault();
    fetchapi.novaCategoria(dados).then((response) => {
      // Se for sucesso, chama a função de fechar (por exemplo, fechar um modal)
      fechar(null); // Considerando que "fechar" seja a função que fecha o modal ou formulário
    })
    .catch((error) => {
      // Caso aconteça um erro na requisição, define o erro
      setErroApi(true);
      console.error("Erro ao criar categoria:", error);
    });
  };
  
  return (
    <div className="blurModal">
      <form id="formCriarCategoria" onSubmit={(e) => criarCategoria(e)}>
        <h2>Criar Categoria</h2>
        <div>
          <h3>Informações da Categoria</h3>
          <label>
            <span>nome:</span>
            <input
              type="text"
              onChange={(e) => setNomeCategoria(e.target.value)}
            />
          </label>
        </div>
        <nav>
          <button
            className="bttCancelarCriarCategoria"
            type="submit"
          >
            Cancelar
          </button>
          <button className="bttriarCriarCategoria">Criar Categoria</button>
        </nav>
      </form>
    </div>
  );
}

export default CriarCategoria;
