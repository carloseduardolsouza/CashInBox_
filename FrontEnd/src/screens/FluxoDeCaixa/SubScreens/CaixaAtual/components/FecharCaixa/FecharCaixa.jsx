import "./FecharCaixa.css";
import { useState, useContext, useCallback, useMemo } from "react";
import caixaFetch from "../../../../../../api/caixaFetch";
import AppContext from "../../../../../../context/AppContext";

const FecharCaixa = ({ atualizar, fecharAba, statusCaixa, id }) => {
  const { setErroApi } = useContext(AppContext);
  const [valorFinal, setValorFinal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Valores computados para melhor performance
  const computedValues = useMemo(() => {
    const numericValue = parseFloat(valorFinal) || 0;
    const hasValidValue = valorFinal.trim() !== "" && numericValue >= 0;
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue);

    return {
      numericValue,
      hasValidValue,
      formattedValue,
      isZero: numericValue === 0
    };
  }, [valorFinal]);

  const handleValueChange = useCallback((e) => {
    const value = e.target.value;
    // Permite apenas números e pontos/vírgulas
    if (value === "" || /^\d*[.,]?\d*$/.test(value)) {
      setValorFinal(value);
    }
  }, []);

  const handleClose = useCallback(() => {
    fecharAba(null);
  }, [fecharAba]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!computedValues.hasValidValue || isLoading) return;
    
    setIsLoading(true);

    const dataCaixa = {
      valor_fechamento: computedValues.numericValue
    };

    try {
      await caixaFetch.fecharCaixa(dataCaixa, id);
      statusCaixa("Fechado");
      atualizar();
      handleClose();
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      setErroApi(true);
    } finally {
      setIsLoading(false);
    }
  }, [
    computedValues.hasValidValue, 
    computedValues.numericValue, 
    isLoading, 
    id, 
    statusCaixa, 
    atualizar, 
    handleClose, 
    setErroApi
  ]);

  // Previne fechamento ao clicar no modal
  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Detecta Enter para submit
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && computedValues.hasValidValue && !isLoading) {
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [computedValues.hasValidValue, isLoading, handleSubmit, handleClose]);

  return (
    <div className="blur-modal" onClick={handleClose}>
      <div 
        className="fechar-caixa-container" 
        onClick={handleModalClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <button 
          className="close-button" 
          onClick={handleClose}
          type="button"
          aria-label="Fechar modal"
          disabled={isLoading}
        >
          ×
        </button>
        
        <div className="modal-header">
          <h2 className="modal-title">
            🔒 Fechamento de Caixa
          </h2>
          <p className="modal-subtitle">
            Informe o saldo final para encerrar o caixa
          </p>
        </div>
        
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="valor-final-input">
              💰 Saldo Final
            </label>
            <input
              id="valor-final-input"
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              placeholder="0,00"
              value={valorFinal}
              onChange={handleValueChange}
              disabled={isLoading}
              required
              autoFocus
              aria-describedby="valor-help"
            />
          </div>

          {/* Preview do valor */}
          {computedValues.hasValidValue && (
            <div className="value-preview">
              <div className="value-preview-label">
                Valor de Fechamento
              </div>
              <p className="value-preview-amount">
                {computedValues.formattedValue}
              </p>
            </div>
          )}

          {/* Aviso para valor zero */}
          {computedValues.isZero && computedValues.hasValidValue && (
            <div className="warning-message">
              <span className="warning-icon">⚠️</span>
              <p className="warning-text">
                Atenção: O caixa será fechado com saldo zero. 
                Certifique-se de que todas as transações foram registradas.
              </p>
            </div>
          )}
          
          <div className="button-group">
            <button 
              type="submit" 
              className="primary-button"
              disabled={!computedValues.hasValidValue || isLoading}
              aria-label={`Fechar caixa com valor de ${computedValues.formattedValue}`}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" />
                  Fechando...
                </>
              ) : (
                <>
                  ✅ Fechar Caixa
                </>
              )}
            </button>
            
            <button
              type="button"
              className="secondary-button"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="Cancelar fechamento"
            >
              ❌ Cancelar
            </button>
          </div>

          <div id="valor-help" className="sr-only">
            Digite o valor final do caixa. Use ponto ou vírgula para decimais.
          </div>
        </form>
      </div>
    </div>
  );
};

export default FecharCaixa;