import "./ItemCaixaAtual.css";
import services from "../../../../../../services/services";

function ItemCaixaAtual({ dados }) {
  const { descricao, valor, data, tipo } = dados;
  return (
    <div id="ItemCaixaAtual">
      <div>
        <div>
          <div id="detalheesteticoItemCaixaAtual">
            <div id="bolinhaItemCaixaAtual" />
            <div id="linhaItemCaixaAtual" />
          </div>
        </div>

        <div>
          <h3>{`${tipo === "entrada" ? "+" : "-"} ${services.formatarCurrency(
            valor
          )}`}</h3>
          <p>{descricao}</p>
        </div>
      </div>

      <p id="HoraItemCaixaAtual">{services.formatarHorario(data)}</p>
    </div>
  );
}

export default ItemCaixaAtual;
