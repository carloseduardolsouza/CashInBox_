import "./GeralCliente.css";
import { useState } from "react";

//Icones
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

function GeralCliente() {
  const [editar, setEditar] = useState(false);

  return (
    <div id="DetalhesClienteINFORMAÇÃO">
      <div className="DivisãoDetalhesCliente">
        <div id="divIconeGeralCliente"><FaUserAlt/></div>
        <h2>{"carlos Eduardo Souza"}</h2>
      </div>
      {(editar && (
        <div className="alinhar">
          <p className="DetalhesClientesP">
            <strong>Codigo: </strong>0{'1'}
          </p>
          <label>
            <p className="DetalhesClientesP">
              <strong>Nome: </strong>
            </p>
            <input
              type="text"
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Nascimento: </strong>
            </p>
            <input
              type="date"
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Genero: </strong>
            </p>
            <select>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Telefone: </strong>
            </p>
            <input
              type="number"
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>CPF: </strong>
            </p>
            <input
              type="number"
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Endereço: </strong>
            </p>
            <input
              type="text"
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Email: </strong>
            </p>
            <input
              type="email"
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Observação: </strong>
            </p>
            <textarea
              id="texto"
              rows="4"
              cols="58"
            />
          </label>
          <button
            className="bttEditarClienteInfo"
            onClick={() => setEditar(false)}
          >
            <FaCheckCircle /> Concluir
          </button>
        </div>
      )) || (
        <div className="alinhar">
          <p className="DetalhesClientesP">
            <strong>Codigo: </strong>0{"1"}
          </p>
          <p className="DetalhesClientesP">
            <strong>Nome: </strong>
            {"Carlos Eduardo L Souza"}
          </p>
          <p className="DetalhesClientesP">
            <strong>Nascimento: </strong>
            {"10/10/2005"}
          </p>
          <p className="DetalhesClientesP">
            <strong>Genero: </strong>
            {"Masculino"}
          </p>
          <p className="DetalhesClientesP">
            <strong>Telefone: </strong>
            {"(62) 9 9336-2090"}
          </p>
          <p className="DetalhesClientesP">
            <strong>CPF: </strong>
            {"724.781.411-81"}
          </p>
          <p className="DetalhesClientesP">
            <strong>Endereço: </strong>
            {"R.2 , Qd.2 , Lt.13 , Jd Petropolis"}
          </p>
          <p className="DetalhesClientesP">
            <strong>Email: </strong>
            {"carlosreiroyale@gmail.com"}
          </p>
          <p className="DetalhesClientesP">
            <strong>Observação: </strong>
            {"observação"}
          </p>
          <button className="bttEditarClienteInfo" onClick={() => setEditar(true)}>
            <FaEdit /> Editar
          </button>
          <button className="bttDeleteClienteInfo">
            <MdDeleteOutline /> Excluir Cliente
          </button>
        </div>
      )}
    </div>
  );
}

export default GeralCliente;
