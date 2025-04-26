import "./Funcionarios.css";

//Icones
import { FaSearch } from "react-icons/fa";
import { IoInformationCircleSharp } from "react-icons/io5";

function Funcionarios() {
  return (
    <div id="Funcionarios">
      <h2>Funcionarios</h2>
      <div>
        <form onSubmit={(e) => /*renderEstoque(e)*/ ``}>
          <button
            className="AddProduto"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/cadastrarFuncionario";
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
                <a href="/detalhesDoFuncionario/1" className="aTdFuncionarios">
                  Carlos Eduardo Lourenço de Souza
                </a>
              </td>
              <td>(62) 9 9336-2090</td>
              <td>R$ 400,00</td>
              <td>CLT</td>
              <td>Ativo</td>
              <td>Vendedor</td>
            </tr>
          </tbody>
          {/*loadingEstoque && <Loading/> || (
                    resultEstoque.map((estoque) => <IntensEstoque data={estoque}/>)
                )*/}
        </table>
      </div>
    </div>
  );
}

export default Funcionarios;
