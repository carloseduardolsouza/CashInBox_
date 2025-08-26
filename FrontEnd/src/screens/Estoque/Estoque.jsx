import "./Estoque.css";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import services from "../../services/services";
import Loading from "../../components/Loading/Loading";

//Icones
import { FaSearch, FaFilter } from "react-icons/fa";
import Select from "react-select";
import produtoFetch from "../../api/produtoFetch";

function Estoque() {
  const { setErroApi, tratarErroApi } = useContext(AppContext);
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState("all");
  const [resultProdutos, setResultProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);

  const buscarProdutos = async () => {
    try {
      const resultado = await produtoFetch.procurarProdutos(pesquisa);

      if (Array.isArray(resultado)) {
        setResultProdutos(resultado);
      } else {
        setResultProdutos([]); // Evita quebrar a UI
        console.warn("Resposta inesperada:", resultado);
        tratarErroApi(resultado);
      }
      setLoading(false);
    } catch (error) {
      setErroApi(true);
    }
  };

  const opcoesFiltro = [
    { value: "todos", label: "todos" },
    { value: "Estoque", label: "Estoque" },
  ];

  useEffect(() => {
    buscarProdutos();
  }, []);

  const renderProdutos = async (e) => {
    e.preventDefault();
    const resultado = await produtoFetch.procurarProdutos(pesquisa);
    setResultProdutos(resultado);
  };

  const handleFiltroToggle = () => {
    setFiltroAberto((prev) => !prev);
  };

  const handleFiltroChange = async (opcao) => {
    setFiltroSelecionado(opcao);
    if (opcao.value === "Estoque") {
      const resultado = await produtoFetch.procurarProdutos(pesquisa);
      const filtrados = Array.isArray(resultado)
        ? resultado.filter((p) => p.ativo === 1)
        : [];
      setResultProdutos(filtrados);
    } else {
      const resultado = await produtoFetch.procurarProdutos(pesquisa);
      setResultProdutos(resultado);
    }
  };

  return (
    <div id="ESTOQUE">
      {loading && <Loading />}
      <h2>Estoque</h2>
      <div>
        <form onSubmit={(e) => renderProdutos(e)}>
          <button
            className="AddProduto"
            onClick={(e) => {
              e.preventDefault();
              navigate("/cadastrarProduto");
            }}
            type="button"
          >
            +
          </button>
          <input
            type="text"
            className="InputClientes"
            placeholder="Procurar no Estoque..."
            onChange={(e) => setPesquisa(e.target.value)}
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
      </div>
      <table className="Table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço de Compra</th>
            <th>Margem</th>
            <th>Preço de Venda</th>
            <th>Em Estoque</th>
            <th>Codigo</th>
          </tr>
        </thead>

        <tbody>
          {resultProdutos.map((dado) => {
            return (
              <tr
                onClick={() => navigate(`/detalhesDoProduto/${dado.id}`)}
                style={{ cursor: "pointer" }}
                className={
                  dado.estoque_min_atingido && dado.ativo === 1
                    ? "estoque_min"
                    : ""
                }
              >
                <td>{dado.nome}</td>
                <td>{services.formatarCurrency(dado.preco_custo)}</td>
                <td>{dado.markup}%</td>
                <td>{services.formatarCurrency(dado.preco_venda)}</td>
                <td>{dado.estoque_atual}</td>
                <td>{dado.id}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Estoque;
