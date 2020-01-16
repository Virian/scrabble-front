import React from 'react';
import classNames from 'classnames';

export default function Square({ children, bonus }) {
  return (
    <div className={classNames('square', bonus ? `square--${bonus.color}` : null)}>
      {!children && bonus ? (
        <span className="square__bonus-text">{bonus.text}</span>
      ) : children}
    </div>
  )
};
