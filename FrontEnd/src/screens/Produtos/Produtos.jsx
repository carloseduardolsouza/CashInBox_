import "./Produtos.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";

//componentes
import ItemProduto from "./components/ItemProduto/ItemProduto";
import Loading from "../../components/Loading/Loading";

//Controlador da api
import produtoFetch from "../../api/produtoFetch";

//icones
import { FaSearch } from "react-icons/fa";

function Produtos() {
  const Data = new Date();
  const log = `${Data.getUTCDate()}/${
    Data.getUTCMonth() + 1
  }/${Data.getUTCFullYear()}`;

  const { tratarErroApi, setErroApi } = useContext(AppContext);

  const [resultProdutos, setResultProdutos] = useState([]);
  const [loading, setloading] = useState(true);
  const [pesquisar, setPesquisar] = useState("all");

  const buscarProdutos = async () => {
    try {
      const resultado = await produtoFetch.procurarProdutos(pesquisar);

      if (Array.isArray(resultado)) {
        setResultProdutos(resultado);
      } else {
        setResultProdutos([]); // Evita quebrar a UI
        console.warn("Resposta inesperada:", resultado);
        tratarErroApi(resultado);
      }
      setloading(false)
    } catch (error) {
      setErroApi(true);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const renderProdutos = async (e) => {
    e.preventDefault();
    setloading(true);
    buscarProdutos();
    setloading(false);
  };

  return (
    <div id="PRODUTOS">
      {loading && <Loading />}
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
