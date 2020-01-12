import React from 'react';
import Tile from '../../Tile';

export default function Rack(props) {
  return (
    <div className="rack">
      {props.tiles.map((tile, index) => (
        <Tile
          key={`rack-tile-${index}`}
          letter={tile.letter}
          score={tile.score}
        />
      ))}
    </div>
  )
};
