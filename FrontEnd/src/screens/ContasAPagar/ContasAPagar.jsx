import "./ContasAPagar.css";
import { useState } from "react";

//Icones
import { FaSearch } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

//componentes
import NovaConta from "./components/NovaConta/NovaConta";
import EditarConta from "./components/EditarConta/EditarConta";
import FunçãoNãoDisponivel from "../../components/FunçãoNãoDisponivel/FunçãoNãoDisponivel";

function ContasAPagar() {
  const [abaSobreposta, setAbaSopreposta] = useState(null);

  const renderAbaSobrePosta = () => {
    switch (abaSobreposta) {
      case "NovaConta":
        return <NovaConta fecharAba={setAbaSopreposta}/>;
      case "EditarConta":
        return <EditarConta fecharAba={setAbaSopreposta}/>;
      case null:
        return null;
    }
  };

  return (
    <div id="ContasAPagar">
      {renderAbaSobrePosta()}
      <h2>Contas a pagar</h2>
      <article className="ArticleClientes">
        <form onSubmit={"" /*(e) => renderClientes(e)*/}>
          <button className="AddCliente" type="button"
          onClick={() => setAbaSopreposta("NovaConta")}>
            +
          </button>
          <input
            type="text"
            className="InputClientes"
            placeholder="Procurar Conta..."
          />
          <button className="Search" type="submit">
            <FaSearch />
          </button>
        </form>
      </article>
      <table className="Table">
        <thead>
          <tr>
            <th>Ação</th>
            <th>Status</th>
            <th>Vencimento</th>
            <th>Valor</th>
            <th>Referente a</th>
            <th>Fornecedor</th>
            <th>Tipo</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <button className="ButtonEditContasAPagar"
              onClick={() => setAbaSopreposta("EditarConta")}
              >
                <FaEdit /> Editar
              </button>
            </td>
            <td>Paga</td>
            <td>10/10</td>
            <td>R$ 2.000,00</td>
            <td>Moveis</td>
            <td>Realiza</td>
            <td>Boleto</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ContasAPagar;
