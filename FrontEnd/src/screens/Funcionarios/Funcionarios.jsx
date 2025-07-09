import "./Funcionarios.css";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

//conexão com a api
import funcionarioFetch from "../../api/funcionarioFetch";

//servissos
import services from "../../services/services";

//Icones
import { FaSearch } from "react-icons/fa";

function Funcionarios() {
  const { setErroApi } = useContext(AppContext);

  const [pesquisaFuncionario, setPesquisaFuncionario] = useState("all");
  const [resultFuncionario, setResultFuncionario] = useState([]);

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const resultado = await funcionarioFetch.procurarFuncionario(
          pesquisaFuncionario
        );
        setResultFuncionario(resultado);
      } catch (err) {
        setErroApi(true);
      }
    };

    buscarClientes();
  }, []);

  const renderFuncionario = async (e) => {
    e.preventDefault();
    const resultado = await funcionarioFetch
      .procurarFuncionario(pesquisaFuncionario)
      .then((response) => {
        setResultFuncionario(response);
        console.log(response);
      })
      .catch((erro) => setErroApi(true));
  };

  const navigate = useNavigate();
  return (
    <div id="Funcionarios">
      <h2>Funcionarios ({resultFuncionario.length})</h2>
      <div>
        <form onSubmit={(e) => renderFuncionario(e)}>
          <button
            className="AddProduto"
            onClick={(e) => {
              e.preventDefault();
              navigate("/cadastrarFuncionario");
            }}
            type="button"
          >
            +
          </button>
          <input
            type="text"
            className="InputClientes"
            placeholder="Procurar no Funcionario..."
            onChange={(e) => setPesquisaFuncionario(e.target.value)}
          />
          <button className="Search" type="submit">
            <FaSearch />
          </button>
        </form>
        <table className="Table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Numero</th>
              <th>Comição D/Mês</th>
              <th>Regime de Contrato</th>
              <th>Status</th>
              <th>Cargo</th>
            </tr>
          </thead>

          <tbody>
            {resultFuncionario.map((data) => (
              <tr key={data.id}>
                <td>
                  <Link
                    to={`/detalhesDoFuncionario/${data.id}`}
                    className="aTdFuncionarios"
                  >
                    {data.nome}
                  </Link>
                </td>
                <td>{services.formatarNumeroCelular(data.telefone)}</td>
                <td>{services.formatarCurrency(data.comissao_mes)}</td>
                <td>{data.regime_contrato}</td>
                <td>{data.status}</td>
                <td>{data.funcao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Funcionarios;
