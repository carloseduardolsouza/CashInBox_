import "./AdicionarSaldo.css";
import { useState, useContext, useCallback } from "react";
import AppContext from "../../../../../../context/AppContext";
import caixaFetch from "../../../../../../api/caixaFetch";

const AdicionarSaldo = ({ fecharAba, idCaixa, atualizar }) => {
  const { setErroApi } = useContext(AppContext);
  const [formData, setFormData] = useState({
    value: "",
    descricao: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);

  const handleClose = useCallback(() => {
    fecharAba(null);
  }, [fecharAba]);

  const adicionarSaldo = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dados = {
      descricao: formData.descricao.trim() || "não definido",
      tipo: "entrada",
      valor: parseFloat(formData.value)
    };

    try {
      await caixaFetch.novaMovimentacao(idCaixa, dados);
      atualizar();
      handleClose();
    } catch (error) {
      setErroApi(true);
      console.error('Erro ao adicionar saldo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, idCaixa, atualizar, handleClose, setErroApi]);

  // Previne fechamento ao clicar no modal
  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="blur-modal" onClick={handleClose}>
      <div className="adicionar-saldo" onClick={handleModalClick}>
        <button 
          className="close-button" 
          onClick={handleClose}
          type="button"
          aria-label="Fechar modal"
        >
          ×
        </button>
        
        <h3 className="modal-title">
          💰 Adicionar Saldo
        </h3>
        
        <form className="form-container" onSubmit={adicionarSaldo}>
          <div className="input-group">
            <label className="input-label" htmlFor="valor-input">
              Valor (R$)
            </label>
            <input
              id="valor-input"
              type="number"
              step="0.01"
              min="0.01"
              className="input-field"
              value={formData.value}
              required
              onChange={handleInputChange('value')}
              placeholder="0,00"
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="descricao-input">
              Descrição
            </label>
            <textarea
              id="descricao-input"
              className="input-field textarea-field"
              placeholder="Adicione uma descrição para esta movimentação..."
              value={formData.descricao}
              onChange={handleInputChange('descricao')}
              disabled={isLoading}
              maxLength={255}
            />
          </div>
          
          <button 
            className="submit-button" 
            type="submit"
            disabled={isLoading || !formData.value}
          >
            {isLoading ? '💾 Salvando...' : '✅ Salvar Movimentação'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdicionarSaldo;