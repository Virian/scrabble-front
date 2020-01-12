import React from 'react';

export default function PlayerScore(props) {
  return (
    <div className="score">
      <span className="score__player-name">{props.name}</span>
      <span>{props.score}</span>
    </div>
  )
}