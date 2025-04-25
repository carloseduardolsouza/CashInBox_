import "./clientes.css";
import { useEffect, useState } from "react";

//Icones
import { FaSearch } from "react-icons/fa";
import { IoInformationCircleSharp } from "react-icons/io5";

//Componentes
//import ItensClientes from "../../components/ItensClientes/ItensClientes"
//import Loading from "../../Components"

//Controlador da Api
//import ProcurarClientesApi from "../../api/fetchapi"

function Clientes() {
  const Data = new Date();
  const log = `${Data.getUTCDate()}/${
    Data.getUTCMonth() + 1
  }/${Data.getUTCFullYear()}`;

  //Controlador de Estados
  const [resultClientes, setResultClientes] = useState([]);
  const [loadingClientes, setloadingClientes] = useState(true);
  const [pesquisar, setPesquisar] = useState("all");

  /*useEffect(() => {
        ProcurarClientesApi.ProcurarCliente(pesquisar).then((response) => {
            setResultClientes(response)
            setloadingClientes(false)
        })
    }, [])*/

  /*const renderClientes = async (e) => {
        e.preventDefault()
        setloadingClientes(true)
        const client = await ProcurarClientesApi.ProcurarCliente(pesquisar)
        setloadingClientes(false)
        setResultClientes(client)
    }*/

  return (
    <div id="CLIENTE">
      <header id="HeaderClientes">
        <h2>Clientes ({/*resultClientes.length*/})</h2>
        <p>{log}</p>
      </header>
      <article className="ArticleClientes">
        <form onSubmit={"" /*(e) => renderClientes(e)*/}>
          <button
            className="AddCliente"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/cadastrarCliente";
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
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Numero</th>
            <th>Endereço</th>
            <th>Total de compras em R$</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td><a href="/detalhesDoCLiente/1" className="aTdClientes">Carlos Eduardo Lourenço de Souza</a></td>
            <td>(62) 9 9336-2090</td>
            <td>R.2 , Qd.2 , Lt.13 , Jd Petropolis</td>
            <td>R$ 2.000</td>
          </tr>
          {/*(loadingClientes && <Loading />) ||
            resultClientes.map((clientes) => {
              return (
                <tr>
                  <td>Carlos Eduardo</td>
                  <td>(62) 9 9336-2090</td>
                  <td>R.2 , Qd.2 , Lt.13 , Jd Petropolis</td>
                  <td>R$ 2.000</td>
                  <td>
                    <button id="AçãoButãoClientes">Ações</button>
                  </td>
                </tr>
              );
            })*/}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;
