import "./Produtos.css";
import { useState, useEffect , useContext } from "react";
import AppContext from "../../context/AppContext";

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

  const {setVencido , setErroApi} = useContext(AppContext)

  const [resultProdutos, setResultProdutos] = useState([]);
  const [loadingProdutos, setloadingProdutos] = useState(true);
  const [pesquisar, setPesquisar] = useState("all");

  const buscarProdutos = async () => {
    try {
      const resultado = await fetchapi.ProcurarProdutos(pesquisar);

      if (
        resultado.message ===
        "Assinatura vencida. Por favor, renove sua assinatura."
      ) {
        setVencido(true);
        return;
      }

      if (Array.isArray(resultado)) {
        setResultProdutos(resultado);
      } else {
        setResultProdutos([]); // Evita o erro
        console.warn("Resposta inesperada:", resultado);
      }

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
