import "./RetirarSaldo.css";
import services from "../../../../../../services/services";
import { useState } from "react";

//icones
import { FaMoneyBill1 } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa";

function RetirarSaldo({ fecharAba }) {
  const [value, setValue] = useState("");

  return (
    <div className="blurModal">
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
                <FaMoneyBill1 style={{margin: 10}}/>
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

            <tr>
              <td>
                <FaWallet style={{margin: 10}}/>
              </td>
              <td>Em conta</td>
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
    </div>
  );
}

export default RetirarSaldo;
