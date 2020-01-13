import React from 'react';

export default function PlayerScore({ name, score }) {
  return (
    <div className="score">
      <span className="score__player-name">{name}</span>
      <span>{score}</span>
    </div>
  )
}