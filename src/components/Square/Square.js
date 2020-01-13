import React from 'react';

export default function Square({ children, bonus }) {
  return (
    <div className={`square ${bonus ? `square--${bonus.color}` : ''}`}>
      {!children && bonus ? (
        <span className="square__bonus-text">{bonus.text}</span>
      ) : children}
    </div>
  )
};
