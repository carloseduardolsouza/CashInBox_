import "./CadastrarFuncionario.css";

//icones
import { FaUserAlt } from "react-icons/fa";

function CadastrarFuncionario() {
  return (
    <div id="novoCliente">
      <h2>Novo Funcionario</h2>
      <p>{"data"}</p>
      <div id="CENTRALIZAR">
        <main className="MainNovoCliente">
          <div alt="Imagem User" className="ImageUser">
            <FaUserAlt />
          </div>
          <form className="articleNovoFuncionario">
            <p>
              <strong>Nome: </strong>
            </p>
            <input
              type="text"
              className="InputNovoCliente"
              placeholder="Nome"
              required
            />
            <p>
              <strong>Numero: </strong>
            </p>
            <input
              type="number"
              className="InputNovoCliente"
              placeholder="Numero"
              required
            />
            <p>
              <strong>Endereço</strong>
            </p>
            <input
              type="text"
              className="InputNovoCliente"
              placeholder="Endereço"
            />
            <p>
              <strong>CPF</strong>
            </p>
            <input
              type="number"
              className="InputNovoCliente"
              placeholder="CPF"
            />
            <p>
              <strong>Email</strong>
            </p>
            <input
              type="text"
              className="InputNovoCliente"
              placeholder="Email"
            />

            <p>
              <strong>Salario</strong>
            </p>
            <input
              type="number"
              className="InputNovoCliente"
              placeholder="Salario em R$"
            />
            <div id="divSelectNovoFuncionario">
              <div>
                <p>
                  <strong>Gênero</strong>
                </p>
                <select className="SelectNovoFuncionario">
                  <option value="Selecione o Genero">Selecione o Genero</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div>
                <p>
                  <strong>Cargo</strong>
                </p>
                <select className="SelectNovoFuncionario">
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
                <select className="SelectNovoFuncionario">
                  <option value="Selecione o Genero">Selecione o Regime de contrato</option>
                  <option value="Vendedor">CLT</option>
                  <option value="Gerente">Contrato</option>
                  <option value="Entregador">Temporario</option>
                </select>
              </div>
            </div>
            <p>Nascimento: </p>
            <input type="date" className="DataNovoCliente" />
            <button className="CadastrarNovoCliente" type="submit">
              Cadastrar
            </button>
            {/*concluido && <Concluindo/>*/}
          </form>
        </main>
      </div>
    </div>
  );
}

export default CadastrarFuncionario;
