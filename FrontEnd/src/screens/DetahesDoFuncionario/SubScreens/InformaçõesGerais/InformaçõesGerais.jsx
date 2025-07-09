import "./InformaçõesGerais.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { MdDeleteOutline } from "react-icons/md";
import { FaEdit, FaCheckCircle, FaUserAlt } from "react-icons/fa";

import services from "../../../../services/services";
import funcionarioFetch from "../../../../api/funcionarioFetch";
import Loading from "../../../../components/Loading/Loading";

function InformacoesGerais({ infoFuncionario }) {
  const navigate = useNavigate();
  const [editar, setEditar] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    endereco: "",
    telefone: "",
    data_nascimento: "",
    genero: "",
    funcao: "",
    regime_contrato: "",
    salario_base: "",
    tipo_comissao: "",
    valor_comissao: "",
    status: "ativo"
  });

  useEffect(() => {
    if (infoFuncionario) {
      setFormData({
        nome: infoFuncionario.nome || "",
        cpf: infoFuncionario.cpf || "",
        email: infoFuncionario.email || "",
        endereco: infoFuncionario.endereco || "",
        telefone: infoFuncionario.telefone || "",
        data_nascimento: infoFuncionario.data_nascimento || "",
        genero: infoFuncionario.genero || "",
        funcao: infoFuncionario.funcao || "",
        regime_contrato: infoFuncionario.regime_contrato || "",
        salario_base: infoFuncionario.salario_base || "",
        tipo_comissao: infoFuncionario.tipo_comissao || "",
        valor_comissao: infoFuncionario.valor_comissao || "",
        status: infoFuncionario.status || "ativo"
      });
    }
  }, [infoFuncionario]);

  if (!infoFuncionario) return <Loading />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const editarFuncionario = async () => {
    const dados = {
      id: infoFuncionario.id,
      ...formData,
      salario_base: Number(formData.salario_base),
      valor_comissao: Number(formData.valor_comissao)
    };

    try {
      await funcionarioFetch.atualizarFuncionario(dados);
      setEditar(false);
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
    }
  };

  const deletarFuncionario = async () => {
    try {
      await funcionarioFetch.deletarFuncionario(infoFuncionario.id);
      navigate("/funcionarios");
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
    }
  };

  const renderField = (label, value, name, type = "text", isSelect = false, options = []) => (
    <label className="field-label">
      <p className="field-title">
        <strong>{label}</strong>
      </p>
      {isSelect ? (
        <select name={name} value={value} onChange={handleChange} className="field-input">
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={handleChange} className="field-input" />
      )}
    </label>
  );

  return (
    <div className="info-container">
      <div className="info-header">
        <div className="info-icon">
          <FaUserAlt />
        </div>
        <h2>{infoFuncionario.nome}</h2>
      </div>

      {editar ? (
        <div className="info-content">
          <p className="field-title">
            <strong>Código: </strong>0{infoFuncionario.id}
          </p>

          {renderField("Nome:", formData.nome, "nome")}
          {renderField("Nascimento:", formData.data_nascimento, "data_nascimento", "date")}
          {renderField("Gênero:", formData.genero, "genero", "text", true, ["Masculino", "Feminino", "Outro"])}
          {renderField("Cargo:", formData.funcao, "funcao", "text", true, ["Vendedor", "Gerente", "Entregador", "Caixa"])}
          {renderField("Regime de Contrato:", formData.regime_contrato, "regime_contrato", "text", true, ["CLT", "Contrato", "Temporário"])}
          {renderField("Telefone:", formData.telefone, "telefone")}
          {renderField("CPF:", formData.cpf, "cpf")}
          {renderField("Endereço:", formData.endereco, "endereco")}
          {renderField("Email:", formData.email, "email", "email")}
          {renderField("Salário Base:", formData.salario_base, "salario_base", "number")}
          {renderField("Tipo de Comissão:", formData.tipo_comissao, "tipo_comissao", "text", true, ["Não contabilizar comissão", "fixa", "percentual"])}
          {renderField("Valor da Comissão:", formData.valor_comissao, "valor_comissao", "number")}
          {renderField("Status:", formData.status, "status", "text", true, ["ativo", "inativo"])}

          <button className="btn-action" onClick={editarFuncionario}>
            <FaCheckCircle /> Concluir
          </button>
        </div>
      ) : (
        <div className="info-content">
          <p className="field-title"><strong>Código:</strong> 0{infoFuncionario.id}</p>
          <p className="field-title"><strong>Nome:</strong> {infoFuncionario.nome}</p>
          <p className="field-title"><strong>Nascimento:</strong> {services.formatarDataNascimento(infoFuncionario.data_nascimento)}</p>
          <p className="field-title"><strong>Gênero:</strong> {infoFuncionario.genero}</p>
          <p className="field-title"><strong>Cargo:</strong> {infoFuncionario.funcao}</p>
          <p className="field-title"><strong>Regime de Contrato:</strong> {infoFuncionario.regime_contrato}</p>
          <p className="field-title"><strong>Telefone:</strong> {services.formatarNumeroCelular(infoFuncionario.telefone)}</p>
          <p className="field-title"><strong>CPF:</strong> {services.formatarCPF(infoFuncionario.cpf)}</p>
          <p className="field-title"><strong>Salario Base:</strong> {services.formatarCurrency(infoFuncionario.salario_base)}</p>
          <p className="field-title"><strong>Tipo de comissão:</strong> {infoFuncionario.tipo_comissao}</p>
          <p className="field-title"><strong>Valor da comissão:</strong> {infoFuncionario.valor_comissao}</p>
          <p className="field-title"><strong>Endereço:</strong> {infoFuncionario.endereco}</p>
          <p className="field-title"><strong>Email:</strong> {infoFuncionario.email}</p>

          <div className="info-actions">
            <button className="btn-action" onClick={() => setEditar(true)}>
              <FaEdit /> Editar
            </button>
            <button className="btn-action" onClick={deletarFuncionario}>
              <MdDeleteOutline /> Deletar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InformacoesGerais;
