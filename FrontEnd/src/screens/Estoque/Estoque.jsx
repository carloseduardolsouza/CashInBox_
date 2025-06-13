import "./Estoque.css";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import services from "../../services/services";

//Icones
import { FaSearch } from "react-icons/fa";
import fetchapi from "../../api/fetchapi";

function Estoque() {
  const { setErroApi , setVencido } = useContext(AppContext);
  const navigate = useNavigate();
  const [modalEstoque, setModalEstoque] = useState(null);

  const [pesquisa, setPesquisa] = useState("all");
  const [resultProdutos, setResultProdutos] = useState([]);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const resultado = await fetchapi.ProcurarProdutos(pesquisa);
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
      } catch {
        setErroApi(true);
      }
    };

    buscarProdutos();
  }, []);

  const renderProdutos = async (e) => {
    e.preventDefault();
    const resultado = await fetchapi.ProcurarProdutos(pesquisa);
    setResultProdutos(resultado);
  };

  return (
    <div id="ESTOQUE">
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
          />
          <button className="Search" type="submit">
            <FaSearch />
          </button>
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
              <tr>
                <td>
                  <Link to={`/detalhesDoProduto/${dado.id}`} id="aTDEstoque">
                    {dado.nome}
                  </Link>
                </td>
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
