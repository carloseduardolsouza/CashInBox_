import "./ItemCaixaAtual.css";
import { memo, useMemo } from "react";
import services from "../../../../../../services/services";

const ItemCaixaAtual = memo(({ dados }) => {
  const { descricao, valor, data, tipo } = dados;

  // Memoiza os valores computados para otimização
  const transactionData = useMemo(() => {
    const isEntrada = tipo === "entrada";
    const formattedValue = services.formatarCurrency(valor);
    const formattedTime = services.formatarHorario(data);
    const cleanDescription = descricao?.trim();
    
    return {
      isEntrada,
      formattedValue,
      formattedTime,
      displayDescription: cleanDescription || "Sem descrição",
      isEmpty: !cleanDescription,
      icon: isEntrada ? "+" : "−",
      typeClass: isEntrada ? "entrada" : "saida",
      badgeText: isEntrada ? "Entrada" : "Saída",
      ariaLabel: `${isEntrada ? 'Entrada' : 'Saída'} de ${formattedValue} em ${formattedTime}${cleanDescription ? `. ${cleanDescription}` : ''}`
    };
  }, [descricao, valor, data, tipo]);

  const {
    isEntrada,
    formattedValue,
    formattedTime,
    displayDescription,
    isEmpty,
    icon,
    typeClass,
    badgeText,
    ariaLabel
  } = transactionData;

  return (
    <div 
      className="item-caixa-atual" 
      role="listitem"
      aria-label={ariaLabel}
    >
      {/* Timeline Visual */}
      <div className="timeline-container">
        <div 
          className={`timeline-dot ${typeClass}`}
          title={`Transação: ${badgeText}`}
        >
          {icon}
        </div>
        <div className="timeline-line" />
      </div>

      {/* Conteúdo da Transação */}
      <div className="content-container">
        <div className="transaction-info">
          <div className="transaction-value-container">
            <h3 className={`transaction-value ${typeClass}`}>
              <span className="transaction-icon">{icon}</span>
              {formattedValue}
            </h3>
            <span className={`transaction-badge ${typeClass}`}>
              {badgeText}
            </span>
          </div>
          
          <p 
            className={`transaction-description ${isEmpty ? 'empty' : ''}`}
            title={isEmpty ? 'Nenhuma descrição fornecida' : displayDescription}
          >
            {displayDescription}
          </p>
        </div>

        <time 
          className="transaction-time"
          dateTime={data}
          title={`Horário da transação: ${formattedTime}`}
        >
          {formattedTime}
        </time>
      </div>
    </div>
  );
});

// Nome para debugging
ItemCaixaAtual.displayName = 'ItemCaixaAtual';

export default ItemCaixaAtual;