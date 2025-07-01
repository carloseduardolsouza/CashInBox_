import "./DetalhesCaixaAnterior.css";
import { useState, useEffect } from "react";
import caixaFetch from "../../../../../api/caixaFetch";
import services from "../../../../../services/services";
import ItemCaixaAtual from "../../CaixaAtual/components/ItemCaixaAtual/ItemCaixaAtual";

function DetalhesCaixaAnterior({ dados, fechar }) {
  const [movimentacoes, setMovimentacoes] = useState([]);

  const buscarMovimentações = async () => {
    const response = await caixaFetch.buscarMovimentacao(dados.id);
    setMovimentacoes(response);
  };

  useEffect(() => {
    buscarMovimentações();
  }, []);

  return (
    <div className="modal-blur">
      <div className="modal-container">
        <h2 className="modal-title">Detalhes do Caixa</h2>
        <p className="modal-date">
          📅 {services.formatarData(dados.data_abertura)} até{" "}
          {services.formatarData(dados.data_fechamento)}
        </p>

        <div className="modal-body">
          {movimentacoes.length ? (
            <div className="movimentacoes-list">
              {movimentacoes.map((mov, index) => (
                <ItemCaixaAtual key={index} dados={mov} />
              ))}
            </div>
          ) : (
            <div className="no-movements">Nenhuma movimentação encontrada</div>
          )}

          <div className="info-values">
            <div className="info-row">
              <span>Valor da Abertura:</span>
              <span>{services.formatarCurrency(dados.valor_abertura)}</span>
            </div>
            <div className="info-row">
              <span>Valor Esperado:</span>
              <span>{services.formatarCurrency(dados.valor_esperado)}</span>
            </div>
            <div className="info-row">
              <span>Valor do Fechamento:</span>
              <span>{services.formatarCurrency(dados.valor_fechamento)}</span>
            </div>
            <div className="info-row">
              <span>Valor Recebido:</span>
              <span>{services.formatarCurrency(dados.total_recebido)}</span>
            </div>

            <button className="fechar-button" onClick={() => fechar(null)}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesCaixaAnterior;
