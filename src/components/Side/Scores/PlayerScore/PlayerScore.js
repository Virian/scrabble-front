import React from 'react';

export default function PlayerScore({ name, score, isActive }) {
  return (
    <div className="score">
      <span className="score__player-name">
        {isActive ? <span>&#x25b6;</span> : ''}{name}
      </span>
      <span className="score__player-score">{score}</span>
    </div>
  )
}