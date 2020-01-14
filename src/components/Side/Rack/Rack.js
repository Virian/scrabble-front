import React from 'react';
import Tile from '../../Tile';

export default function Rack({ tiles }) {
  return (
    <div className="rack">
      {tiles.map((tile, index) => (
        <Tile
          key={`rack-tile-${index}`}
          letter={tile.letter}
          score={tile.score}
          movable
        />
      ))}
    </div>
  )
};