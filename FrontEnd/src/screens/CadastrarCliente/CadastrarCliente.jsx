import "./CadastrarCliente.css";
import { useReducer, useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import Executando from "../../components/Executando/Executando";
import { FaUserAlt } from "react-icons/fa";
import clientesFetch from "../../api/clientesFetch";

const initialState = {
  nome: "",
  numero: "",
  endereco: "",
  cpf: "",
  email: "",
  genero: "",
  nascimento: "",
};

function formReducer(state, action) {
  if (action.type === "RESET") return initialState;
  return { ...state, [action.name]: action.value };
}

function CadastrarCliente() {
  const { setErroApi } = useContext(AppContext);
  const [form, dispatch] = useReducer(formReducer, initialState);
  const [executando, setExecutando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ name, value });
  };

  const cadastrarCliente = async (e) => {
    e.preventDefault();
    setExecutando(true);

    const dados = {
      nome: form.nome.charAt(0).toUpperCase() + form.nome.slice(1).toLowerCase(),
      cpf_cnpj: form.cpf,
      email: form.email,
      genero: form.genero,
      telefone: form.numero,
      data_nascimento: form.nascimento,
      endereco: form.endereco,
    };

    try {
      await clientesFetch.novoCliente(dados);
      dispatch({ type: "RESET" });
    } catch (err) {
      setErroApi(true);
    } finally {
      setExecutando(false);
    }
  };

  return (
    <div className="cadastro-cliente">
      {executando && <Executando />}
      <h2>Novo Cliente</h2>
      <p>{new Date().toLocaleDateString()}</p>

      <div className="cadastro-cliente__centralizar">
        <main className="cadastro-cliente__main">
          <div className="cadastro-cliente__foto">
            <FaUserAlt />
          </div>
          <form className="cadastro-cliente__form" onSubmit={cadastrarCliente}>
            <label>
              <strong>Nome:</strong>
              <input
                type="text"
                name="nome"
                className="cadastro-cliente__input"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome"
                required
              />
            </label>

            <label>
              <strong>Número:</strong>
              <input
                type="number"
                name="numero"
                className="cadastro-cliente__input"
                value={form.numero}
                onChange={handleChange}
                placeholder="Número"
                required
              />
            </label>

            <label>
              <strong>Endereço:</strong>
              <input
                type="text"
                name="endereco"
                className="cadastro-cliente__input"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Endereço"
              />
            </label>

            <label>
              <strong>CPF:</strong>
              <input
                type="number"
                name="cpf"
                className="cadastro-cliente__input"
                value={form.cpf}
                onChange={handleChange}
                placeholder="CPF"
              />
            </label>

            <label>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                className="cadastro-cliente__input"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </label>

            <label>
              <strong>Gênero:</strong>
              <select
                name="genero"
                className="cadastro-cliente__select"
                value={form.genero}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o Gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </label>

            <label>
              <strong>Nascimento:</strong>
              <input
                type="date"
                name="nascimento"
                className="cadastro-cliente__date"
                value={form.nascimento}
                onChange={handleChange}
              />
            </label>

            <button className="cadastro-cliente__button" type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default CadastrarCliente;
