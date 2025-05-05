import "./Preços.css";

//Icones
import { FaCheckCircle } from "react-icons/fa";

function Preços() {
  return (
    <div id="Preços">
      <div id="SectionPreçosPart1">
        <label>
          <p>Preço de Custo:</p>
          <input type="text" placeholder="R$ 100,00"/>
        </label>

        <label>
          <p>Markup:</p>
          <input type="text" placeholder="100%"/>
        </label>

        <label>
          <p>Preço de Venda:</p>
          <input type="text" placeholder="R$ 200,00"/>
        </label>
      </div>
      <div id="SectionPreçosPart2">
        <label>
          <p>Máximo de desconto:</p>
          <input type="text" placeholder="50%"/>
        </label>

        <label>
          <p>Preço Promocional:</p>
          <input type="text" />
        </label>

        <label>
          <p>Parcelamento s/juros:</p>
          <select>
            <option value="1x">1x</option>
            <option value="2x">2x</option>
            <option value="3x">3x</option>
            <option value="4x">4x</option>
            <option value="5x">5x</option>
            <option value="6x">6x</option>
          </select>
        </label>
      </div>
        <button id="SalvarPreços"><FaCheckCircle /> Salvar Alterações</button>
    </div>
  );
}

export default Preços;
