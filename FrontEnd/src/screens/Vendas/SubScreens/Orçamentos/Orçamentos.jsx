import "./Orçamentos.css";
import { useState } from "react";

//Icones
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { BsFillSendFill } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

//componentes
import EnviarOrçamento from "./EnviarOrçamento/EnviarOrçamento";
import FaturarVenda from "./FaturarVenda/FaturarVenda";

function Orçamentos() {
  const [modal, setModal] = useState(null);

  const renderModal = () => {
    switch (modal) {
      case "Faturar":
        return <FaturarVenda fechar={setModal} />;
      case "Enviar":
        return <EnviarOrçamento fechar={setModal}/>;
      case null:
        return null;
    }
  };
  return (
    <div>
      {renderModal()}
      <table className="Table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Produto</th>
            <th>total</th>
            <th>data</th>
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Carlos Eduardo Lourenço de Souza</td>
            <td>
              <a href="/" className="aTdOrçamento">
                Comoda Capri
              </a>
            </td>
            <td>R$ 2.000,00</td>
            <td>10/10/2005</td>
            <td className="tdAçãoOrçamento">
              <button
                className="ButãoFaturarOrçamento ButãoTabelaOrçamento"
                onClick={() => setModal("Faturar")}
              >
                <FaMoneyCheckDollar />
                Faturar
              </button>
              <button
                className="ButãoTabelaOrçamento ButãoEnviarOrçamento"
                onClick={() => setModal("Enviar")}
              >
                <BsFillSendFill /> Enviar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Orçamentos;
