import "./GoalProgressBar.css";

function GoalProgressBar({ current, goal, label, color = '#0295ff' }) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="goal-progress-container">
      <div className="goal-progress-header">
        <span className="goal-label">{label}</span>
        <span className="goal-values">{current.toLocaleString('pt-BR')} / {goal.toLocaleString('pt-BR')}</span>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: percentage >= 100 ? '#10B981' : percentage >= 70 ? '#F59E0B' : color
          }}
        >
          <span className="progress-percentage">{Math.floor(percentage)}%</span>
        </div>
      </div>
    </div>
  );
}

export default GoalProgressBar;