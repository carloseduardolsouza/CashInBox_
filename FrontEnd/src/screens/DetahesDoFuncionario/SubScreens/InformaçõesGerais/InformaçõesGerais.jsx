import "./InformaçõesGerais.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Ícones
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit, FaCheckCircle, FaUserAlt } from "react-icons/fa";

//serviços
import services from "../../../../services/services";

// Conexão com a API
import fetchapi from "../../../../api/fetchapi";

// Componentes
import Loading from "../../../../components/Loading/Loading";

function InformaçõesGerais({ infoFuncionario }) {
  const {
    id,
    nome,
    cpf,
    email,
    endereco,
    data_nascimento,
    telefone,
    funcao,
    genero,
    data_admissao,
    salario_base,
    tipo_comissao,
    valor_comissao,
    status,
    regime_contrato,
  } = infoFuncionario || {};

  const navigate = useNavigate();
  const [editar, setEditar] = useState(false);

  // Estados para edição
  const [nomeEdit, setNomeEdit] = useState("");
  const [cpfEdit, setCpfEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [enderecoEdit, setEnderecoEdit] = useState("");
  const [telefoneEdit, setTelefoneEdit] = useState("");
  const [dataNascimentoEdit, setDataNascimentoEdit] = useState("");
  const [generoEdit, setGeneroEdit] = useState("");
  const [funcaoEdit, setFuncaoEdit] = useState("");
  const [regimeContratoEdit, setRegimeContratoEdit] = useState("");

  useEffect(() => {
    if (infoFuncionario) {
      setNomeEdit(nome || "");
      setCpfEdit(cpf || "");
      setEmailEdit(email || "");
      setEnderecoEdit(endereco || "");
      setTelefoneEdit(telefone || "");
      setDataNascimentoEdit(data_nascimento || "");
      setGeneroEdit(genero || "");
      setFuncaoEdit(funcao || "");
      setRegimeContratoEdit(regime_contrato || "");
    }
  }, [infoFuncionario]);

  if (!infoFuncionario) return <Loading />;

  const editarFuncionario = async () => {
    const dados = {
      id,
      nome: nomeEdit,
      cpf: cpfEdit,
      email: emailEdit,
      telefone: telefoneEdit,
      data_nascimento: dataNascimentoEdit,
      endereco: enderecoEdit,
      genero: generoEdit,
      funcao: funcaoEdit,
      regime_contrato: regimeContratoEdit,
    };

    try {
      await fetchapi.AtualizarFuncionario(dados);
      setEditar(false);
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
    }
  };

  const deletarFuncionario = async () => {
    try {
      await fetchapi.DeletarFuncionario(id);
      navigate("/funcionarios");
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
    }
  };

  return (
    <div id="DetalhesClienteINFORMAÇÃO">
      <div className="DivisãoDetalhesCliente">
        <div id="divIconeGeralCliente">
          <FaUserAlt />
        </div>
        <h2>{nome}</h2>
      </div>

      {editar ? (
        <div className="alinhar">
          <p className="DetalhesClientesP">
            <strong>Código: </strong>0{id}
          </p>

          <label>
            <p className="DetalhesClientesP">
              <strong>Nome:</strong>
            </p>
            <input
              type="text"
              value={nomeEdit}
              onChange={(e) => setNomeEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Nascimento:</strong>
            </p>
            <input
              type="date"
              value={dataNascimentoEdit}
              onChange={(e) => setDataNascimentoEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Gênero:</strong>
            </p>
            <select
              value={generoEdit}
              onChange={(e) => setGeneroEdit(e.target.value)}
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Cargo:</strong>
            </p>
            <select
              value={funcaoEdit}
              onChange={(e) => setFuncaoEdit(e.target.value)}
            >
              <option value="Vendedor">Vendedor</option>
              <option value="Gerente">Gerente</option>
              <option value="Entregador">Entregador</option>
              <option value="Caixa">Caixa</option>
            </select>
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Regime de Contrato:</strong>
            </p>
            <select
              value={regimeContratoEdit}
              onChange={(e) => setRegimeContratoEdit(e.target.value)}
            >
              <option value="CLT">CLT</option>
              <option value="Contrato">Contrato</option>
              <option value="Temporário">Temporário</option>
            </select>
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Telefone:</strong>
            </p>
            <input
              type="text"
              value={telefoneEdit}
              onChange={(e) => setTelefoneEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>CPF:</strong>
            </p>
            <input
              type="text"
              value={cpfEdit}
              onChange={(e) => setCpfEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Endereço:</strong>
            </p>
            <input
              type="text"
              value={enderecoEdit}
              onChange={(e) => setEnderecoEdit(e.target.value)}
            />
          </label>

          <label>
            <p className="DetalhesClientesP">
              <strong>Email:</strong>
            </p>
            <input
              type="email"
              value={emailEdit}
              onChange={(e) => setEmailEdit(e.target.value)}
            />
          </label>

          <button className="bttEditarClienteInfo" onClick={editarFuncionario}>
            <FaCheckCircle /> Concluir
          </button>
        </div>
      ) : (
        <div className="alinhar">
          <p className="DetalhesClientesP">
            <strong>Código:</strong> 0{id}
          </p>
          <p className="DetalhesClientesP">
            <strong>Nome:</strong> {nome}
          </p>
          <p className="DetalhesClientesP">
            <strong>Nascimento:</strong>{" "}
            {services.formatarDataNascimento(data_nascimento)}
          </p>
          <p className="DetalhesClientesP">
            <strong>Gênero:</strong> {genero}
          </p>
          <p className="DetalhesClientesP">
            <strong>Cargo:</strong> {funcao}
          </p>
          <p className="DetalhesClientesP">
            <strong>Regime de Contrato:</strong> {regime_contrato}
          </p>
          <p className="DetalhesClientesP">
            <strong>Telefone:</strong>
            {services.formatarNumeroCelular(telefone)}
          </p>
          <p className="DetalhesClientesP">
            <strong>CPF:</strong> {services.formatarCPF(cpf)}
          </p>
          <p className="DetalhesClientesP">
            <strong>Salario Base:</strong> {services.formatarCurrency(salario_base)}
          </p>
          <p className="DetalhesClientesP">
            <strong>Tipo de comissão:</strong> {tipo_comissao}
          </p>
          <p className="DetalhesClientesP">
            <strong>Valor da comissão:</strong> {valor_comissao}
          </p>
          <p className="DetalhesClientesP">
            <strong>Endereço:</strong> {endereco}
          </p>
          <p className="DetalhesClientesP">
            <strong>Email:</strong> {email}
          </p>

          <div id="areaButtonInfoFuncionarios">
            <button
              className="bttEditarClienteInfo"
              onClick={() => setEditar(true)}
            >
              <FaEdit /> Editar
            </button>
            <button
              className="bttEditarClienteInfo"
              onClick={deletarFuncionario}
            >
              <MdDeleteOutline /> Deletar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InformaçõesGerais;
