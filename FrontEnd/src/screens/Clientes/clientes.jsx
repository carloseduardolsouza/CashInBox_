import "./clientes.css";
import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";

//Icones
import { FaSearch } from "react-icons/fa";

function Clientes() {
  const Data = new Date();
  const log = `${Data.getUTCDate()}/${
    Data.getUTCMonth() + 1
  }/${Data.getUTCFullYear()}`;

  const navigate = useNavigate()

  //Controlador de Estados
  const [resultClientes, setResultClientes] = useState([]);
  const [loadingClientes, setloadingClientes] = useState(true);
  const [pesquisar, setPesquisar] = useState("all");

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
            <td><Link to={"/detalhesDoCLiente/1"} className="aTdClientes">Carlos Eduardo Lourenço de Souza</Link></td>
            <td>(62) 9 9336-2090</td>
            <td>R.2 , Qd.2 , Lt.13 , Jd Petropolis</td>
            <td>R$ 2.000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;
