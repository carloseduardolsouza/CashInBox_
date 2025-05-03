import React from 'react';

const GoalProgressBar = ({ current, goal }) => {
  const percentage = Math.min((current / goal) * 100, 100); // Nunca ultrapassa 100%

  const containerStyles = {
    height: 30,
    width: '100%',
    backgroundColor: '#e0e0de',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
  };

  const fillerStyles = {
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: percentage < 70 ? '#8884d8' : '#82ca9d',
    transition: 'width 0.5s ease-in-out',
    textAlign: 'right',
    borderRadius: 'inherit',
    paddingRight: 10,
    color: 'white',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        {Math.floor(percentage)}%
      </div>
    </div>
  );
};

export default GoalProgressBar;