import "./GeralCliente.css";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../../../context/AppContext";
import { useNavigate } from "react-router-dom";

//conexão com a api
import clientesFetch from "../../../../api/clientesFetch";

//serviços
import services from "../../../../services/services";

//componentes
import Loading from "../../../../components/Loading/Loading";

//Icones
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

function GeralCliente({ infoCliente }) {
  const {
    id,
    nome,
    cpf_cnpj,
    email,
    endereco,
    data_nascimento,
    telefone,
    genero,
  } = infoCliente || {};
  const navigate = useNavigate();

  const { adicionarAviso , setErroApi } = useContext(AppContext);

  const [editar, setEditar] = useState(false);

  const [nomeEdit, setNomeEdit] = useState(nome);
  const [cpfEdit, setCpfEdit] = useState(cpf_cnpj);
  const [emailEdit, setEmailEdit] = useState(email);
  const [generoEdit, setGeneroEdit] = useState(genero);
  const [enderecoEdit, setenderecoEdit] = useState(endereco);
  const [telefoneEdit, setTelefoneEdit] = useState(telefone);
  const [data_nascimentoEdit, setData_nascimentoEdit] =
    useState(data_nascimento);

  useEffect(() => {
    if (infoCliente) {
      setNomeEdit(infoCliente.nome || "");
      setCpfEdit(infoCliente.cpf_cnpj || "");
      setEmailEdit(infoCliente.email || "");
      setGeneroEdit(infoCliente.genero || "");
      setenderecoEdit(infoCliente.endereco || "");
      setTelefoneEdit(infoCliente.telefone || "");
      setData_nascimentoEdit(infoCliente.data_nascimento || "");
    }
  }, [infoCliente]);

  if (!infoCliente) {
    return <Loading />;
  }

  const editarCliente = () => {
    let dados = {
      id: id,
      nome: nomeEdit.charAt(0).toUpperCase() + nomeEdit.slice(1).toLowerCase(),
      cpf_cnpj: cpfEdit,
      email: emailEdit,
      genero: generoEdit,
      telefone: telefoneEdit,
      data_nascimento: data_nascimentoEdit,
      endereco: enderecoEdit,
    };

    clientesFetch.atualizarCliente(dados).then(() => {
      adicionarAviso("sucesso" , "SUCESSO - Dados do cliente editado com sucesso!")
      setEditar(false);
    }).catch(() => {
      setErroApi(true)
    });
  };

  const deletarCliente = () => {
    clientesFetch.deletarCliente(id);
    navigate("/clientes");
  };

  return (
    <div id="DetalhesClienteINFORMAÇÃO">
      <div className="DivisãoDetalhesCliente">
        <div id="divIconeGeralCliente">
          <FaUserAlt />
        </div>
        <h2>{nome}</h2>
      </div>
      {(editar && (
        <div className="alinhar">
          <p className="DetalhesClientesP">
            <strong>Codigo: </strong>0{id}
          </p>
          <label>
            <p className="DetalhesClientesP">
              <strong>Nome: </strong>
            </p>
            <input
              type="text"
              value={nomeEdit}
              onChange={(e) => setNomeEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Nascimento: </strong>
            </p>
            <input
              type="date"
              value={data_nascimentoEdit}
              onChange={(e) => setData_nascimentoEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Genero: </strong>
            </p>
            <select
              onChange={(e) => setGeneroEdit(e.target.value)}
              value={generoEdit}
            >
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
              value={telefoneEdit}
              onChange={(e) => setTelefoneEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>CPF: </strong>
            </p>
            <input
              type="number"
              value={cpfEdit}
              onChange={(e) => setCpfEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Endereço: </strong>
            </p>
            <input
              type="text"
              value={enderecoEdit}
              onChange={(e) => setenderecoEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Email: </strong>
            </p>
            <input
              type="email"
              value={emailEdit}
              onChange={(e) => setEmailEdit(e.target.value)}
            />
          </label>
          <button
            className="bttEditarClienteInfo"
            onClick={() => editarCliente()}
          >
            <FaCheckCircle /> Concluir
          </button>
        </div>
      )) || (
        <div className="alinhar">
          <p className="DetalhesClientesP">
            <strong>Codigo: </strong>0{id}
          </p>
          <p className="DetalhesClientesP">
            <strong>Nome: </strong>
            {nomeEdit}
          </p>
          <p className="DetalhesClientesP">
            <strong>Nascimento: </strong>
            {services.formatarDataNascimento(data_nascimentoEdit)}
          </p>
          <p className="DetalhesClientesP">
            <strong>Genero: </strong>
            {generoEdit}
          </p>
          <p className="DetalhesClientesP">
            <strong>Telefone: </strong>
            {services.formatarNumeroCelular(telefoneEdit)}
          </p>
          <p className="DetalhesClientesP">
            <strong>CPF: </strong>
            {services.formatarCPF(cpfEdit)}
          </p>
          <p className="DetalhesClientesP">
            <strong>Endereço: </strong>
            {enderecoEdit}
          </p>
          <p className="DetalhesClientesP">
            <strong>Email: </strong>
            {emailEdit}
          </p>

          <div id="areaButtonInfoClientes">
            <button
              className="bttEditarClienteInfo"
              onClick={() => setEditar(true)}
            >
              <FaEdit /> Editar
            </button>
            <button
              className="bttDeleteClienteInfo"
              onClick={() => deletarCliente()}
            >
              <MdDeleteOutline /> Excluir Cliente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeralCliente;
