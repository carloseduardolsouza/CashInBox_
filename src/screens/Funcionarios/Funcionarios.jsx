import "./Funcionarios.css";
import { Link , useNavigate } from "react-router-dom";

//Icones
import { FaSearch } from "react-icons/fa";

function Funcionarios() {
  const navigate = useNavigate()
  return (
    <div id="Funcionarios">
      <h2>Funcionarios</h2>
      <div>
        <form>
          <button
            className="AddProduto"
            onClick={(e) => {
              e.preventDefault();
              navigate("/cadastrarFuncionario")
            }}
            type="button"
          >
            +
          </button>
          <input
            type="text"
            className="InputClientes"
            placeholder="Procurar no Funcionario..."
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
            <tr>
              <td>
                <Link to={"/detalhesDoFuncionario/1"} className="aTdFuncionarios">
                  Carlos Eduardo Lourenço de Souza
                </Link>
              </td>
              <td>(62) 9 9336-2090</td>
              <td>R$ 400,00</td>
              <td>CLT</td>
              <td>Ativo</td>
              <td>Vendedor</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Funcionarios;
