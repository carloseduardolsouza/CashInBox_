// EmBreve.jsx
import "./EmBreve.css";

function EmBreve({ onClose }) {
  return (
    <div className="embreve-overlay">
      <div className="embreve-modal">
        <div className="embreve-icon">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="embreve-icon-svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        
        <h2 className="embreve-title">Função Disponível Em Breve</h2>
        
        <p className="embreve-description">
          Esta funcionalidade ainda está em desenvolvimento e será lançada em breve. 
          Assim que estiver pronta, estará disponível para os planos 
          <strong> Essencial</strong> ou superiores.
        </p>
        
        <div className="embreve-actions">
          <button 
            className="embreve-button-primary"
            onClick={onClose}
          >
            Entendi
          </button>
          
          <button className="embreve-button-secondary">
            Ver Planos
          </button>
        </div>
        
        <div className="embreve-progress">
          <div className="embreve-progress-bar">
            <div className="embreve-progress-fill"></div>
          </div>
          <span className="embreve-progress-text">Em desenvolvimento...</span>
        </div>
      </div>
    </div>
  );
}

export default EmBreve;