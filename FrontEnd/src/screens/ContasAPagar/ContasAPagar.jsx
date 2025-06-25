import "./ContasAPagar.css";
import { useState, useEffect } from "react";
import contasPagarFetch from "../../api/contasPagarFetch";
import services from "../../services/services"

//Icones
import { FaSearch } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

//componentes
import NovaConta from "./components/NovaConta/NovaConta";
import EditarConta from "./components/EditarConta/EditarConta";

function ContasAPagar() {
  const [abaSobreposta, setAbaSopreposta] = useState(null);
  const [contasPagar, setContasPagar] = useState([]);

  const buscarContas = async () => {
    await contasPagarFetch.contasAll().then((response) => {
      setContasPagar(response);
    });
  };

  const renderAbaSobrePosta = () => {
    switch (abaSobreposta) {
      case "NovaConta":
        return (
          <NovaConta fecharAba={setAbaSopreposta} atualizar={buscarContas} />
        );
      case "EditarConta":
        return <EditarConta fecharAba={setAbaSopreposta} />;
      case null:
        return null;
    }
  };

  useEffect(() => {
    buscarContas();
  }, []);

  return (
    <div id="ContasAPagar">
      {renderAbaSobrePosta()}
      <h2>Contas a pagar</h2>
      <article className="ArticleClientes">
        <form onSubmit={"" /*(e) => renderClientes(e)*/}>
          <button
            className="AddCliente"
            type="button"
            onClick={() => setAbaSopreposta("NovaConta")}
          >
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
            <th>Faturar</th>
          </tr>
        </thead>

        <tbody>
          {contasPagar.map((dados) => {
            console.log(dados);
            return (
              <tr>
                <td>
                  <button
                    className="ButtonEditContasAPagar"
                    onClick={() => setAbaSopreposta("EditarConta")}
                  >
                    <FaEdit /> Editar
                  </button>
                </td>
                <td>{dados.status}</td>
                <td>{services.formatarDataNascimento(dados.data_vencimento)}</td>
                <td>{services.formatarCurrency(dados.valor_total)}</td>
                <td>{dados.categoria}</td>
                <td>
                  <button>Pago</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ContasAPagar;
