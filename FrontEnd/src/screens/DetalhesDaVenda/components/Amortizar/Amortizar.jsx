import React, { useState, useEffect, useContext } from "react";
import services from "../../../../services/services";
import "./Amortizar.css";
import vendaFetch from "../../../../api/vendaFetch";
import AppContext from "../../../../context/AppContext";

function Amortizar({ fechar, dados }) {
  const [valorAmortizacao, setValorAmortizacao] = useState("");
  const [proxParcela, setProxParcela] = useState(0);
  const { adicionarAviso } = useContext(AppContext);

  useEffect(() => {
    if (dados && dados.length > 0) {
      setProxParcela(dados[0].valor_parcela);
    }
  }, [dados]);

  const handleSalvar = () => {
    var conteudo = {
      valorProxParcelas: proxParcela,
    };
    vendaFetch.amortizarParcela(dados[0].id_venda, conteudo);
    adicionarAviso("sucesso", "SUCESSO - PARCELAS AMORTIZADAS COM SUCESSO");
    fechar(null);
  };

  const handleCancelar = () => {
    setValorAmortizacao("");
    fechar(null);
  };

  const calcularProximasParcelas = (valor) => {
    if (!dados || dados.length === 0 || !valor) {
      setProxParcela(dados?.[0]?.valor_parcela || 0);
      return;
    }

    const valorAmort = parseFloat(valor);
    if (isNaN(valorAmort) || valorAmort <= 0) {
      setProxParcela(dados[0].valor_parcela);
      return;
    }

    const totalFaltante = dados[0].valor_parcela * dados.length - valorAmort;
    const novaParcela = totalFaltante / dados.length;

    // Garante que a nova parcela não seja negativa
    setProxParcela(Math.max(0, novaParcela));
  };

  const handleValorChange = (e) => {
    const valor = e.target.value;
    setValorAmortizacao(valor);
    calcularProximasParcelas(valor);
  };

  return (
    <div className="blurModal">
      <div className="amortizar-container">
        <div className="header">
          <h2 className="title">Amortização</h2>
          <button className="close-btn" onClick={handleCancelar}>
            ×
          </button>
        </div>

        <div className="card-detalhes">
          <div className="card-amortizar">
            <strong className="card-value">{dados?.length || 0}</strong>
            <span className="card-label">Parcelas restantes</span>
          </div>

          <div className="card-amortizar">
            <strong className="card-value">
              {dados?.[0]?.valor_parcela
                ? services.formatarCurrency(dados[0].valor_parcela)
                : "R$ 0,00"}
            </strong>
            <span className="card-label">Valor atual parcela</span>
          </div>

          <div className="card-amortizar">
            <strong className="card-value">
              {dados?.[0]?.data_vencimento
                ? services.formatarDataNascimento(dados[0].data_vencimento)
                : "--/--/----"}
            </strong>
            <span className="card-label">Próximo vencimento</span>
          </div>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label className="input-label">Valor a ser Amortizado</label>
            <input
              type="number"
              className="input-field"
              value={valorAmortizacao}
              onChange={handleValorChange}
              placeholder="Digite o valor"
              min="0"
              step="0.01"
            />
          </div>

          <div className="result-section">
            <div className="result-item">
              <span className="result-label">Próxima parcela</span>
              <span className="result-value">
                {services.formatarCurrency(proxParcela)}
              </span>
            </div>
          </div>

          <div className="button-group">
            <button className="btn btn-primary" onClick={handleSalvar}>
              Salvar
            </button>
            <button className="btn btn-secondary" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Amortizar;
