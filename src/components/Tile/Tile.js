import React from 'react';

export default function Tile(props) {
  return (
    <div className={`tile ${props.movable ? 'tile--movable' : ''}`}>
      <span className="tile__letter">{props.letter}</span>
      <span className="tile__score">{props.score}</span>
    </div>
  )
};
