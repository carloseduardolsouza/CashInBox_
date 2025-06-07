import "./Produtos.css";
import { useState, useEffect } from "react";
import { Form } from "react-router-dom";

//componentes
import ItemProduto from "./components/ItemProduto/ItemProduto";
//import Loading from "../../components/AçãoRealizada/AçãoRealizada";

//Controlador da api
import fetchapi from "../../api/fetchapi";

//icones
import { FaSearch } from "react-icons/fa";

function Produtos() {
  const Data = new Date();
  const log = `${Data.getUTCDate()}/${
    Data.getUTCMonth() + 1
  }/${Data.getUTCFullYear()}`;

  const [resultProdutos, setResultProdutos] = useState([]);
  const [loadingProdutos, setloadingProdutos] = useState(true);
  const [pesquisar, setPesquisar] = useState("all");

  const buscarProdutos = async () => {
    try {
      const resultado = await fetchapi.ProcurarProdutos(pesquisar);
      setResultProdutos(resultado);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const renderProdutos = async (e) => {
    e.preventDefault();
    setloadingProdutos(true);
    buscarProdutos()
    setloadingProdutos(false);
  };

  return (
    <div id="PRODUTOS">
      <header id="HeaderProduto">
        <h2>Produtos ({resultProdutos.length})</h2>
        <p>{log}</p>
      </header>
      <article className="ArticleProduto">
        <form onSubmit={(e) => renderProdutos(e)}>
          <input
            type="text"
            className="InputProduto"
            placeholder="Procurar Produto..."
            onChange={(e) => setPesquisar(e.target.value)}
          />
          <button className="Search" type="submit">
            <FaSearch />
          </button>
        </form>
      </article>
      <table className="tableProdutos">
        {resultProdutos.map((produto) => {
          return <ItemProduto dado={produto} />;
        })}
      </table>
    </div>
  );
}

export default Produtos;
