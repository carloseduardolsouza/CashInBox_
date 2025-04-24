import "./Funcionarios.css";

//Icones
import { FaSearch } from "react-icons/fa";

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
        <table className="TableEstoque">
        <div className="TableHeader">
          <p className="itemTabelTitle">Nome</p>
          <p className="itemTabelTitle">Numero</p>
          <p className="itemTabelTitle">Comição D/Mês</p>
          <p className="itemTabelTitle">Status</p>
          <p className="itemTabelTitle">Ação</p>
        </div>
        {/*loadingEstoque && <Loading/> || (
                    resultEstoque.map((estoque) => <IntensEstoque data={estoque}/>)
                )*/}
      </table>
      </div>
    </div>
  );
}

export default Funcionarios;
