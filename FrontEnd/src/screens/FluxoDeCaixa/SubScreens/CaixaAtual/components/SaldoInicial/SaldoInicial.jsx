import "./SaldoInicial.css";
import { useState, useContext, useCallback, useMemo } from "react";
import caixaFetch from "../../../../../../api/caixaFetch";
import AppContext from "../../../../../../context/AppContext";

const SaldoInicial = ({ atualizar, fecharAba, statusCaixa }) => {
  const { setErroApi } = useContext(AppContext);
  const [valorInicial, setValorInicial] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sugestões de valores comuns
  const valueSuggestions = useMemo(() => [
    100, 200, 500, 1000
  ], []);

  // Valores computados para melhor performance
  const computedValues = useMemo(() => {
    const numericValue = parseFloat(valorInicial) || 0;
    const hasValidValue = valorInicial.trim() !== "" && numericValue >= 0;
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue);

    return {
      numericValue,
      hasValidValue,
      formattedValue,
      isZero: numericValue === 0,
      hasValue: valorInicial.trim() !== ""
    };
  }, [valorInicial]);

  const handleValueChange = useCallback((e) => {
    const value = e.target.value;
    // Permite apenas números e pontos/vírgulas
    if (value === "" || /^\d*[.,]?\d*$/.test(value)) {
      setValorInicial(value);
    }
  }, []);

  const handleSuggestionClick = useCallback((value) => {
    setValorInicial(value.toString());
  }, []);

  const handleClose = useCallback(() => {
    fecharAba(null);
  }, [fecharAba]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);

    const dataCaixa = {
      valor_abertura: computedValues.numericValue
    };

    try {
      await caixaFetch.abrirCaixa(dataCaixa);
      statusCaixa("Aberto");
      atualizar();
      handleClose();
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      setErroApi(true);
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    computedValues.numericValue, 
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
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [isLoading, handleSubmit, handleClose]);

  return (
    <div className="blur-modal" onClick={handleClose}>
      <div 
        className="saldo-inicial-container" 
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
            🚀 Abertura de Caixa
          </h2>
          <p className="modal-subtitle">
            Defina o saldo inicial para começar as operações
          </p>
        </div>
        
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="valor-inicial-input">
              💰 Saldo Inicial
            </label>
            
            <div className="input-wrapper">
              <span className="currency-symbol">R$</span>
              <input
                id="valor-inicial-input"
                type="number"
                step="0.01"
                min="0"
                className="input-field"
                placeholder="0,00"
                value={valorInicial}
                onChange={handleValueChange}
                disabled={isLoading}
                autoFocus
                aria-describedby="valor-help suggestions-help"
              />
            </div>

            {/* Sugestões de valores */}
            <div className="value-suggestions" id="suggestions-help">
              {valueSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  aria-label={`Definir valor como ${new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(suggestion)}`}
                >
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(suggestion)}
                </button>
              ))}
            </div>
          </div>

          {/* Preview do valor */}
          {computedValues.hasValue && (
            <div className="value-preview">
              <div className="value-preview-label">
                Saldo de Abertura
              </div>
              <p className="value-preview-amount">
                {computedValues.formattedValue}
              </p>
            </div>
          )}

          {/* Informação sobre valor zero */}
          {(computedValues.isZero && computedValues.hasValue) || !computedValues.hasValue ? (
            <div className="info-card">
              <span className="info-icon">💡</span>
              <p className="info-text">
                {computedValues.isZero && computedValues.hasValue 
                  ? "O caixa será aberto sem saldo inicial. Você poderá adicionar dinheiro posteriormente."
                  : "Digite o valor inicial do caixa ou selecione uma das sugestões acima."
                }
              </p>
            </div>
          ) : null}
          
          <div className="button-group">
            <button 
              type="submit" 
              className="primary-button"
              disabled={isLoading}
              aria-label={computedValues.hasValue 
                ? `Abrir caixa com saldo inicial de ${computedValues.formattedValue}`
                : "Abrir caixa"
              }
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" />
                  Abrindo...
                </>
              ) : (
                <>
                  ✅ Abrir Caixa
                </>
              )}
            </button>
            
            <button
              type="button"
              className="secondary-button"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="Cancelar abertura"
            >
              ❌ Cancelar
            </button>
          </div>

          <div id="valor-help" className="sr-only">
            Digite o valor inicial do caixa. Use ponto ou vírgula para decimais.
            Você pode usar as sugestões de valores ou definir um valor personalizado.
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaldoInicial;