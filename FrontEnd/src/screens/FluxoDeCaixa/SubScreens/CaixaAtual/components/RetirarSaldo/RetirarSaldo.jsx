import "./RetirarSaldo.css";
import { useState, useCallback, useMemo } from "react";
import services from "../../../../../../services/services";

// Ícones - importando do mesmo pacote que o código original
import { FaMoneyBill1, FaWallet } from "react-icons/fa6";
import { FaArrowDown, FaSave } from "react-icons/fa";

const RetirarSaldo = ({ fecharAba, saldoData = { dinheiro: 500.00, conta: 750.50 } }) => {
  const [withdrawalData, setWithdrawalData] = useState({
    cash: "",
    account: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Configuração dos meios de pagamento
  const paymentMethods = useMemo(() => [
    {
      id: 'cash',
      name: 'Dinheiro',
      icon: FaMoneyBill1,
      balance: saldoData.dinheiro,
      color: 'cash'
    },
    {
      id: 'account',
      name: 'Em Conta',
      icon: FaWallet,
      balance: saldoData.conta,
      color: 'account'
    }
  ], [saldoData]);

  // Calcula o total de retirada
  const totalWithdrawal = useMemo(() => {
    const cashValue = parseFloat(withdrawalData.cash.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const accountValue = parseFloat(withdrawalData.account.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    return cashValue + accountValue;
  }, [withdrawalData]);

  // Valida se há valores para retirar
  const hasValidWithdrawal = useMemo(() => {
    return totalWithdrawal > 0;
  }, [totalWithdrawal]);

  const handleInputChange = useCallback((methodId) => (e) => {
    const maskedValue = services.mascaraDeDinheroInput(e);
    const numericValue = parseFloat(maskedValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const method = paymentMethods.find(m => m.id === methodId);
    
    // Valida se o valor não excede o saldo disponível
    const newErrors = { ...errors };
    if (numericValue > method.balance) {
      newErrors[methodId] = `Valor excede saldo disponível (R$ ${method.balance.toFixed(2).replace('.', ',')})`;
    } else {
      delete newErrors[methodId];
    }
    
    setErrors(newErrors);
    setWithdrawalData(prev => ({
      ...prev,
      [methodId]: maskedValue
    }));
  }, [errors, paymentMethods, services]);

  const handleClose = useCallback(() => {
    fecharAba(null);
  }, [fecharAba]);

  const handleSubmit = useCallback(async () => {
    if (!hasValidWithdrawal || Object.keys(errors).length > 0) return;
    
    setIsLoading(true);
    
    try {
      // Simula API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Retirada processada:', {
        cash: withdrawalData.cash,
        account: withdrawalData.account,
        total: totalWithdrawal
      });
      
      handleClose();
    } catch (error) {
      console.error('Erro ao processar retirada:', error);
    } finally {
      setIsLoading(false);
    }
  }, [hasValidWithdrawal, errors, withdrawalData, totalWithdrawal, handleClose]);

  // Previne fechamento ao clicar no modal
  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  return (
    <div className="blur-modal" onClick={handleClose}>
      <div className="retirar-saldo" onClick={handleModalClick}>
        <button 
          className="close-button" 
          onClick={handleClose}
          type="button"
          aria-label="Fechar modal"
        >
          ×
        </button>
        
        <h3 className="modal-title">
          <FaArrowDown /> Retirar Valores
        </h3>
        
        <table className="withdrawal-table">
          <thead className="table-header">
            <tr>
              <th></th>
              <th>Meio de Pagamento</th>
              <th>Saldo em Caixa</th>
              <th>Valor de Retirada</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method) => (
              <tr key={method.id} className="table-row">
                <td className="table-cell">
                  <div className={`payment-icon ${method.color}`}>
                    <method.icon />
                  </div>
                </td>
                <td className="table-cell">
                  <div className="payment-method">{method.name}</div>
                </td>
                <td className="table-cell">
                  <div className="balance-amount">
                    {formatCurrency(method.balance)}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="withdrawal-input-container">
                    <input
                      type="text"
                      className={`withdrawal-input ${errors[method.id] ? 'error' : ''}`}
                      value={withdrawalData[method.id]}
                      onChange={handleInputChange(method.id)}
                      placeholder="R$ 0,00"
                      disabled={isLoading}
                      title={errors[method.id] || ''}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {totalWithdrawal > 0 && (
          <div className="total-summary">
            <div className="total-amount">
              Total a Retirar: {formatCurrency(totalWithdrawal)}
            </div>
          </div>
        )}
        
        <button 
          className="submit-button"
          onClick={handleSubmit}
          disabled={!hasValidWithdrawal || Object.keys(errors).length > 0 || isLoading}
          type="button"
        >
          {isLoading ? (
            <>💾 Processando...</>
          ) : (
            <>
              <FaSave />
              Confirmar Retirada
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RetirarSaldo;