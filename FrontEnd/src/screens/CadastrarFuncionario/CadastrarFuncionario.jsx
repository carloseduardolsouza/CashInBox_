import "./CadastrarFuncionario.css";
import { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { FaUserAlt } from "react-icons/fa";
import funcionarioFetch from "../../api/funcionarioFetch";

function CadastrarFuncionario() {
  const { setErroApi, adicionarAviso } = useContext(AppContext);
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tipoComissao, setTipoComissao] = useState("");
  const [valorComissao, setValorComissao] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [salario, setSalario] = useState("");
  const [genero, setGenero] = useState("");
  const [cargo, setCargo] = useState("");
  const [regime_contrato, setRegime_contrato] = useState("CLT");
  const [nascimento, setNascimento] = useState("");

  const log = new Date().toLocaleDateString();

  const cadastrarFuncionario = async (e) => {
    e.preventDefault();

    const dados = {
      nome: nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase(),
      cpf,
      telefone: numero,
      email,
      salario_base: Number(salario),
      data_nascimento: nascimento,
      genero: genero,
      funcao: cargo,
      endereco,
      tipo_comissao: tipoComissao,
      valor_comissao: Number(valorComissao),
      regime_contrato,
    };

    try {
      await funcionarioFetch.novoFuncionario(dados);
      setCpf("");
      setSalario("");
      setRegime_contrato("CLT");
      setValorComissao("");
      setTipoComissao("Não contabilizar comissão");
      setCargo("");
      setEmail("");
      setEndereco("");
      setGenero("");
      setNome("");
      setNumero("");
      setNascimento("");
      adicionarAviso(
        "sucesso",
        "SUCESSO - Funcionário cadastrado com sucesso !"
      );
    } catch {
      setErroApi(true);
    }
  };

  return (
    <div className="funcionario">
      <h2>Novo Funcionário</h2>
      <p>{log}</p>
      <div className="funcionario__wrapper">
        <main className="funcionario__main">
          <div className="funcionario__avatar">
            <FaUserAlt />
          </div>
          <form className="funcionario__form" onSubmit={cadastrarFuncionario}>
            <label>
              <strong>Nome:</strong>
              <input
                type="text"
                className="funcionario__input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                required
              />
            </label>

            <label>
              <strong>Número:</strong>
              <input
                type="number"
                className="funcionario__input"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Número"
                required
              />
            </label>

            <label>
              <strong>Endereço:</strong>
              <input
                type="text"
                className="funcionario__input"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço"
                required
              />
            </label>

            <label>
              <strong>CPF:</strong>
              <input
                type="number"
                className="funcionario__input"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF"
                required
              />
            </label>

            <label>
              <strong>Email:</strong>
              <input
                type="email"
                className="funcionario__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </label>

            <label>
              <strong>Salário:</strong>
              <input
                type="number"
                className="funcionario__input"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                placeholder="R$"
                required
              />
            </label>

            <div className="funcionario__commission-wrapper">
              <label>
                <strong>Tipo de Comissão:</strong>
                <select
                  className="funcionario__select"
                  value={tipoComissao}
                  onChange={(e) => setTipoComissao(e.target.value)}
                >
                  <option value="Não contabilizar comissão">
                    Não contabilizar comissão
                  </option>
                  <option value="fixa">Fixa</option>
                  <option value="percentual">Percentual</option>
                </select>
              </label>

              <label>
                <strong>Valor:</strong>
                <input
                  type="number"
                  className="funcionario__commission-value"
                  value={valorComissao}
                  onChange={(e) => setValorComissao(e.target.value)}
                  placeholder="5"
                  required
                />
              </label>
            </div>

            <div className="funcionario__select-group">
              <div>
                <label>
                  <strong>Gênero:</strong>
                  <select
                    className="funcionario__select"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </label>
              </div>

              <div>
                <label>
                  <strong>Cargo:</strong>
                  <select
                    className="funcionario__select"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                  >
                    <option value="Vendedor">Vendedor</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Entregador">Entregador</option>
                    <option value="Caixa">Caixa</option>
                  </select>
                </label>
              </div>

              <div>
                <label>
                  <strong>Regime de Contrato:</strong>
                  <select
                    className="funcionario__select"
                    value={regime_contrato}
                    onChange={(e) => setRegime_contrato(e.target.value)}
                  >
                    <option value="CLT">CLT</option>
                    <option value="Contrato">Contrato</option>
                    <option value="Temporario">Temporário</option>
                  </select>
                </label>
              </div>
            </div>

            <label>
              <strong>Nascimento:</strong>
              <input
                type="date"
                className="funcionario__date"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="funcionario__button">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default CadastrarFuncionario;
