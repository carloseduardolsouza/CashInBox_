import "./clientes.css";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

import Loading from "../../components/Loading/Loading";

//Icones
import { FaSearch } from "react-icons/fa";

//Conexão com api
import clientesFetch from "../../api/clientesFetch";

//serviços
import services from "../../services/services";

function Clientes() {
  const { setErroApi, tratarErroApi } = useContext(AppContext);

  const Data = new Date();
  const log = `${Data.getUTCDate()}/${
    Data.getUTCMonth() + 1
  }/${Data.getUTCFullYear()}`;

  const navigate = useNavigate();

  //Controlador de Estados
  const [resultClientes, setResultClientes] = useState([]);
  const [pesquisar, setPesquisar] = useState("all");

  const [loading, setLoading] = useState(true);

  const buscarClientes = async () => {
    try {
      const resultado = await clientesFetch.procurarCliente(pesquisar);

      if (Array.isArray(resultado)) {
        setResultClientes(resultado);
      } else {
        setResultClientes([]); // Evita o erro
        console.warn("Resposta inesperada:", resultado);
      }
      setLoading(false);
      tratarErroApi(resultado);
    } catch (err) {
      setErroApi(true);
    }
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  const renderClientes = async (e) => {
    e.preventDefault();
    buscarClientes();
  };

  return (
    <div id="CLIENTE">
      {loading && <Loading />}
      <header id="HeaderClientes">
        <h2>Clientes ({resultClientes.length})</h2>
        <p>{log}</p>
      </header>
      <article className="ArticleClientes">
        <form onSubmit={(e) => renderClientes(e)}>
          <button
            className="AddCliente"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate("/cadastrarCliente");
            }}
          >
            +
          </button>
          <input
            type="text"
            className="InputClientes"
            placeholder="Procurar Cliente..."
            onChange={(e) => setPesquisar(e.target.value)}
          />
          <button className="Search" type="submit">
            <FaSearch />
          </button>
        </form>
      </article>
      <table className="Table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Numero</th>
            <th>Endereço</th>
            <th>Total de compras em R$</th>
          </tr>
        </thead>

        <tbody>
          {resultClientes.map((dado) => {
            return (
              <tr>
                <td>
                  <Link
                    to={`/detalhesDoCLiente/${dado.id}`}
                    className="aTdClientes"
                  >
                    {dado.nome}
                  </Link>
                </td>
                <td>
                  <a
                    href={`https://wa.me/55${dado.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {services.formatarNumeroCelular(dado.telefone)}
                  </a>
                </td>
                <td>
                  {!dado.endereco || dado.endereco.trim() === ""
                    ? "Desconhecido"
                    : dado.endereco.length > 30
                    ? dado.endereco.slice(0, 30) + "..."
                    : dado.endereco}
                </td>
                <td>{services.formatarCurrency(dado.total_compras)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;
