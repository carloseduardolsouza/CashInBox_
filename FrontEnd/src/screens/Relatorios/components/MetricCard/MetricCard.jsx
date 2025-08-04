import "./MetricCard.css";

function MetricCard({ title, value, trend, isActive, onClick, icon }) {
  return (
    <div 
      className={`metric-card ${isActive ? 'metric-card-active' : ''}`}
      onClick={onClick}
    >
      <div className="metric-header">
        <span className="metric-icon">{icon}</span>
        <span className="metric-title">{title}</span>
      </div>
      <div className="metric-value">{value}</div>
      {trend && (
        <div className={`metric-trend ${trend > 0 ? 'trend-positive' : 'trend-negative'}`}>
          {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}

export default MetricCard;