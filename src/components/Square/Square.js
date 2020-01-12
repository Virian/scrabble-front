import React from 'react';

export default function Square(props) {
  return (
    <div className={`square ${props.bonus ? `square--${props.bonus.color}` : ''}`}>
      {!props.children && props.bonus ? (
        <span className="square__bonus-text">{props.bonus.text}</span>
      ) : props.children}
    </div>
  )
};
