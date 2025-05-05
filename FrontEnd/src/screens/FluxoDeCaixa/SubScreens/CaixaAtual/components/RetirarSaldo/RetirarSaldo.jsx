import "./RetirarSaldo.css";
import services from "../../../../../../services/services";
import { useState } from "react";

//icones
import { FaMoneyBill1 } from "react-icons/fa6";

function RetirarSaldo({ fecharAba }) {
  const [value, setValue] = useState("");

  return (
    <div id="RetirarSaldo">
      <button id="FecharAba" onClick={() => fecharAba(null)}>
        X
      </button>
      <h3>Retirar Valores</h3>
      <table className="Table">
        <thead>
          <tr>
            <th>*</th>
            <th>Meio de pagamento</th>
            <th>valor em caixa</th>
            <th>valor de retirada</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <FaMoneyBill1 />
            </td>
            <td>Dinheiro</td>
            <td>R$ 500,00</td>
            <td>
              <input
                type="text"
                id="valorRetirada"
                value={value}
                onChange={(e) => {
                  setValue(services.mascaraDeDinheroInput(e));
                }}
                placeholder="Digite o valor"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button id="ButtonSalvarRetirarSaldo">Salvar</button>
    </div>
  );
}

export default RetirarSaldo;
