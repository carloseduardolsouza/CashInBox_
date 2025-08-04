import "./DateFilter.css";

function DateFilter({ dataInicial, dataFinal, onDataInicialChange, onDataFinalChange, onApply }) {
  return (
    <div className="filters-container">
      <div className="date-filters">
        <label>
          Data Inicial:
          <input 
            type="date" 
            value={dataInicial}
            onChange={(e) => onDataInicialChange(e.target.value)}
            className="date-input"
          />
        </label>
        <label>
          Data Final:
          <input 
            type="date" 
            value={dataFinal}
            onChange={(e) => onDataFinalChange(e.target.value)}
            className="date-input"
          />
        </label>
        <button className="apply-filter-btn" onClick={onApply}>
          Aplicar Filtro
        </button>
      </div>
    </div>
  );
}

export default DateFilter;