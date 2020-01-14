import React from 'react';

export default function Tile({ letter, score, movable }) {
  return (
    <div className={`tile ${movable ? 'tile--movable' : ''}`}>
      <span className="tile__letter">{letter}</span>
      {score ? <span className="tile__score">{score}</span> : null}
    </div>
  )
};
