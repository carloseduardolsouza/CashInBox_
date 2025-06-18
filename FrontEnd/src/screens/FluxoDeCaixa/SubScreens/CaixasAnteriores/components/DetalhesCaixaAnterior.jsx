import "./DetalhesCaixaAnterior.css";

import { useState, useEffect } from "react";
import fetchapi from "../../../../../api/fetchapi";

import services from "../../../../../services/services";

import ItemCaixaAtual from "../../CaixaAtual/components/ItemCaixaAtual/ItemCaixaAtual";

function DetalhesCaixaAnterior({ dados, fechar }) {
  console.log(dados);
  const [movimentacoes, setMovimentacoes] = useState([]);

  const buscarMovimentações = async () => {
    await fetchapi.BuscarMovimentacao(dados.id).then((response) => {
      setMovimentacoes(response);
      console.log(response);
    });
  };

  useEffect(() => {
    buscarMovimentações();
  }, []);
  return (
    <div className="blurModal">
      <div id="DetalhesCaixaAnterior">
        <div>
          <h3>
            {services.formatarData(dados.data_abertura)} -{" "}
            {services.formatarData(dados.data_fechamento)}
          </h3>

          <div id="section2partes">
            <div id="movimentaçãoDetalhes">
              {movimentacoes.length != 0 ? movimentacoes.map((response) => {
                return <ItemCaixaAtual dados={response} />;
              }) : "nem uma moviementação encontrada"}
            </div>

            <div id="divInfoDetalhesCaixa">
              <p>
                <strong>Valor da abertura: </strong>
                {services.formatarCurrency(dados.valor_abertura)}
              </p>
              <p>
                <strong>Valor esperado: </strong>
                {services.formatarCurrency(dados.valor_esperado)}
              </p>
              <p>
                <strong>Valor do fechamento: </strong>
                {services.formatarCurrency(dados.valor_fechamento)}
              </p>
              <p>
                <strong>Valor Recebido: </strong>
                {services.formatarCurrency(dados.total_recebido)}
              </p>
              <div>
                <button id="buttonDetalhesCaixa" onClick={() => fechar(null)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesCaixaAnterior;
