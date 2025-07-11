import "./GeralCliente.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../../../context/AppContext";
import clientesFetch from "../../../../api/clientesFetch";
import services from "../../../../services/services";
import Loading from "../../../../components/Loading/Loading";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit, FaCheckCircle, FaUserAlt } from "react-icons/fa";

function GeralCliente({ infoCliente }) {
  const navigate = useNavigate();
  const { adicionarAviso, setErroApi } = useContext(AppContext);
  const [editar, setEditar] = useState(false);
  const [cliente, setCliente] = useState({
    nome: "",
    cpf_cnpj: "",
    email: "",
    genero: "",
    endereco: "",
    telefone: "",
    data_nascimento: "",
  });

  useEffect(() => {
    if (infoCliente) {
      setCliente({
        nome: infoCliente.nome || "",
        cpf_cnpj: infoCliente.cpf_cnpj || "",
        email: infoCliente.email || "",
        genero: infoCliente.genero || "",
        endereco: infoCliente.endereco || "",
        telefone: infoCliente.telefone || "",
        data_nascimento: infoCliente.data_nascimento || "",
      });
    }
  }, [infoCliente]);

  if (!infoCliente) return <Loading />;

  const handleChange = (field, value) => {
    setCliente(prev => ({ ...prev, [field]: value }));
  };

  const editarCliente = () => {
    const dados = {
      id: infoCliente.id,
      nome: cliente.nome.charAt(0).toUpperCase() + cliente.nome.slice(1).toLowerCase(),
      cpf_cnpj: cliente.cpf_cnpj,
      email: cliente.email,
      genero: cliente.genero,
      telefone: cliente.telefone,
      data_nascimento: cliente.data_nascimento,
      endereco: cliente.endereco,
    };

    clientesFetch.atualizarCliente(dados)
      .then(() => {
        adicionarAviso("sucesso", "SUCESSO - Dados do cliente editado com sucesso!");
        setEditar(false);
      })
      .catch(() => setErroApi(true));
  };

  const deletarCliente = () => {
    clientesFetch.deletarCliente(infoCliente.id);
    navigate("/clientes");
  };

  const renderCampo = (label, value, field, type = "text", isSelect = false) => (
    <label>
      <p className="DetalhesClientesP"><strong>{label}: </strong></p>
      {isSelect ? (
        <select value={value} onChange={e => handleChange(field, e.target.value)}>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => handleChange(field, e.target.value)}
        />
      )}
    </label>
  );

  const renderTexto = (label, value) => (
    <p className="DetalhesClientesP"><strong>{label}: </strong>{value}</p>
  );

  return (
    <div id="DetalhesClienteINFORMAÇÃO">
      <div className="DivisãoDetalhesCliente">
        <div id="divIconeGeralCliente"><FaUserAlt /></div>
        <h2>{infoCliente.nome}</h2>
      </div>

      <div className="alinhar">
        {renderTexto("Codigo", `0${infoCliente.id}`)}

        {editar ? (
          <>
            {renderCampo("Nome", cliente.nome, "nome")}
            {renderCampo("Nascimento", cliente.data_nascimento, "data_nascimento", "date")}
            {renderCampo("Genero", cliente.genero, "genero", "text", true)}
            {renderCampo("Telefone", cliente.telefone, "telefone", "number")}
            {renderCampo("CPF", cliente.cpf_cnpj, "cpf_cnpj", "number")}
            {renderCampo("Endereço", cliente.endereco, "endereco")}
            {renderCampo("Email", cliente.email, "email", "email")}

            <button className="bttEditarClienteInfo" onClick={editarCliente}>
              <FaCheckCircle /> Concluir
            </button>
          </>
        ) : (
          <>
            {renderTexto("Nome", cliente.nome)}
            {renderTexto("Nascimento", services.formatarDataNascimento(cliente.data_nascimento))}
            {renderTexto("Genero", cliente.genero)}
            {renderTexto("Telefone", services.formatarNumeroCelular(cliente.telefone))}
            {renderTexto("CPF", services.formatarCPF(cliente.cpf_cnpj))}
            {renderTexto("Endereço", cliente.endereco)}
            {renderTexto("Email", cliente.email)}

            <div id="areaButtonInfoClientes">
              <button className="bttEditarClienteInfo" onClick={() => setEditar(true)}>
                <FaEdit /> Editar
              </button>
              <button className="bttDeleteClienteInfo" onClick={deletarCliente}>
                <MdDeleteOutline /> Excluir Cliente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GeralCliente;
