import "./CadastrarFuncionario.css";
import { useState , useContext } from "react";
import AppContext from "../../context/AppContext"

//icones
import { FaUserAlt } from "react-icons/fa";

//conexão com a api
import fetchapi from "../../api/fetchapi";

function CadastrarFuncionario() {
  const {setErroApi} = useContext(AppContext)
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [salario, setSalario] = useState("");
  const [genero, setGenero] = useState("");
  const [cargo, setCargo] = useState("");
  const [regime_contrato, setRegime_contrato] = useState("CLT");
  const [nascimento, setNascimento] = useState("");

  const cadastrarFuncionario = (e) => {
    e.preventDefault();
    let dados = {
      nome: nome,
      cpf: cpf,
      telefone: numero,
      email: email,
      salario_base: salario,
      data_nascimento: nascimento,
      genero: genero,
      funcao: cargo,
      endereco: endereco,
      regime_contrato: regime_contrato,
    };

    fetchapi
      .NovoFuncionario(dados)
      .then((resposta) => {
        window.alert("Cliente criado com sucesso!", resposta);
        setCpf("");
        setSalario("");
        setRegime_contrato("CLT");
        setCargo("");
        setEmail("");
        setEndereco("");
        setGenero("");
        setNome("");
        setNumero("");
        setNascimento("");
      })
      .catch((erro) => {
        setErroApi(true)
      });
  };

  return (
    <div id="novoCliente">
      <h2>Novo Funcionario</h2>
      <p>{"data"}</p>
      <div id="CENTRALIZAR">
        <main className="MainNovoCliente">
          <div alt="Imagem User" className="ImageUser">
            <FaUserAlt />
          </div>
          <form
            className="articleNovoFuncionario"
            onSubmit={(e) => cadastrarFuncionario(e)}
          >
            <p>
              <strong>Nome: </strong>
            </p>
            <input
              type="text"
              className="InputNovoCliente"
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              value={nome}
              required
            />
            <p>
              <strong>Numero: </strong>
            </p>
            <input
              type="number"
              className="InputNovoCliente"
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Numero"
              value={numero}
              required
            />
            <p>
              <strong>Endereço</strong>
            </p>
            <input
              type="text"
              className="InputNovoCliente"
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço"
              value={endereco}
            />
            <p>
              <strong>CPF</strong>
            </p>
            <input
              type="number"
              className="InputNovoCliente"
              onChange={(e) => setCpf(e.target.value)}
              placeholder="CPF"
              value={cpf}
            />
            <p>
              <strong>Email</strong>
            </p>
            <input
              type="text"
              className="InputNovoCliente"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              value={email}
            />

            <p>
              <strong>Salario</strong>
            </p>
            <input
              type="number"
              className="InputNovoCliente"
              onChange={(e) => setSalario(e.target.value)}
              value={salario}
              placeholder="Salario em R$"
            />
            <div id="divSelectNovoFuncionario">
              <div>
                <p>
                  <strong>Gênero</strong>
                </p>
                <select
                  className="SelectNovoFuncionario"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                >
                  <option value="Selecione o Genero">Selecione o Genero</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div>
                <p>
                  <strong>Cargo</strong>
                </p>
                <select
                  className="SelectNovoFuncionario"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                >
                  <option value="Selecione o Genero">Selecione o Cargo</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Entregador">Entregador</option>
                  <option value="Caixa">Caixa</option>
                </select>
              </div>

              <div>
                <p>
                  <strong>Regime de contrato</strong>
                </p>
                <select
                  className="SelectNovoFuncionario"
                  onChange={(e) => setRegime_contrato(e.target.value)}
                  value={regime_contrato}
                >
                  <option value="Selecione o Genero">
                    Selecione o Regime de contrato
                  </option>
                  <option value="CLT">CLT</option>
                  <option value="Contrato">Contrato</option>
                  <option value="Temporario">Temporario</option>
                </select>
              </div>
            </div>
            <p>Nascimento: </p>
            <input
              type="date"
              className="DataNovoCliente"
              onChange={(e) => setNascimento(e.target.value)}
            />
            <button className="CadastrarNovoCliente" type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default CadastrarFuncionario;
