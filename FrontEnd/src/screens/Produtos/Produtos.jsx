import "./Produtos.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext";
import ItemProduto from "./components/ItemProduto/ItemProduto";
import Loading from "../../components/Loading/Loading";
import produtoFetch from "../../api/produtoFetch";
import categoriaFetch from "../../api/categoriaFetch";
import { FaSearch, FaFilter } from "react-icons/fa";
import Select from "react-select";

function Produtos() {
  const Data = new Date();
  const log = `${Data.getUTCDate()}/${Data.getUTCMonth() + 1}/${Data.getUTCFullYear()}`;

  const { tratarErroApi, setErroApi } = useContext(AppContext);

  const [resultProdutos, setResultProdutos] = useState([]);
  const [loading, setloading] = useState(true);
  const [pesquisar, setPesquisar] = useState("all");
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const opcoesFiltro = categorias.map((dados) => ({
    value: dados.id,
    label: dados.nome,
  }));

  const buscarProdutos = async () => {
    try {
      setloading(true);
      const resultado = await produtoFetch.procurarProdutos(
        pesquisar,
        filtroSelecionado?.value
      );

      if (Array.isArray(resultado)) {
        setResultProdutos(resultado);
      } else {
        setResultProdutos([]);
        console.warn("Resposta inesperada:", resultado);
        tratarErroApi(resultado);
      }
    } catch (error) {
      setErroApi(true);
    } finally {
      setloading(false);
    }
  };

  const buscarCategoria = async () => {
    try {
      const response = await categoriaFetch.listarCategorias();
      setCategorias(response);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    buscarProdutos();
    buscarCategoria();
  }, []);

  // Atualiza produtos sempre que filtro ou pesquisa muda
  useEffect(() => {
    buscarProdutos();
  }, [filtroSelecionado]);

  const renderProdutos = async (e) => {
    e.preventDefault();
    buscarProdutos();
  };

  const handleFiltroToggle = () => {
    setFiltroAberto((prev) => !prev);
  };

  const handleFiltroChange = (opcao) => {
    setFiltroSelecionado(opcao);
  };

  return (
    <div id="PRODUTOS">
      {loading && <Loading />}
      <header id="HeaderProduto">
        <h2>Produtos ({resultProdutos.length})</h2>
        <p>{log}</p>
      </header>
      <article className="ArticleProduto">
        <form onSubmit={renderProdutos} className="formSearchProdutos">
          <input
            type="text"
            className="InputProduto"
            placeholder="Procurar Produto..."
            onChange={(e) => setPesquisar(e.target.value)}
          />
          <button className="Search" type="submit">
            <FaSearch />
          </button>
          <button
            className="SearchFilter"
            type="button"
            onClick={handleFiltroToggle}
          >
            <FaFilter />
          </button>

          {filtroAberto && (
            <div className="filtroSelectContainer">
              <Select
                options={opcoesFiltro}
                value={filtroSelecionado}
                onChange={(e) => handleFiltroChange(e)}
                placeholder="Filtrar por..."
                isSearchable
              />
            </div>
          )}
        </form>
      </article>
      <table className="tableProdutos">
        {resultProdutos.map((produto, index) => (
          <ItemProduto key={index} dado={produto} />
        ))}
      </table>
    </div>
  );
}

export default Produtos;
