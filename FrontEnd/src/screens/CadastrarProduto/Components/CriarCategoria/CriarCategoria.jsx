import "./CriarCategoria.css";
import { useState, useContext, useEffect } from "react";
import AppContext from "../../../../context/AppContext";

//conexão com a api
import categoriaFetch from "../../../../api/categoriaFetch";

import { MdDelete } from "react-icons/md";

function CriarCategoria({ fechar }) {
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);

  const { setErroApi } = useContext(AppContext);

  useEffect(() => {
    categoriaFetch
      .listarCategorias()
      .then((response) => {
        setCategorias(response);
      })
      .catch(() => setErroApi(true));
  }, []);

  const criarCategoria = (e) => {
    const dados = {
      nome:
        nomeCategoria.charAt(0).toUpperCase() +
        nomeCategoria.slice(1).toLowerCase(),
    };
    e.preventDefault();
    categoriaFetch
      .novaCategoria(dados)
      .then((response) => {
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
      <div id="formCriarCategoria">
        <form onSubmit={(e) => criarCategoria(e)}>
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
              onClick={(e) => {
                e.preventDefault();
                fechar(null);
              }}
            >
              Cancelar
            </button>
            <button className="bttriarCriarCategoria" type="submit">
              Criar Categoria
            </button>
          </nav>
        </form>
        <div id="categoriasExistentes">
          {categorias.map((dados) => {
            return (
              <span>
                {" "}
                <p>{dados.nome}</p>{" "}
                <button id="deletarCategoria">
                  <MdDelete />
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CriarCategoria;
