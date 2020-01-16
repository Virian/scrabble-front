import React from 'react';
import Tile from '../../Tile';

export default function Rack({ tiles, moveRackTiles }) {
  return (
    <div className="rack">
      {Array(7).fill(0).map((_, index) => (
        <div
          key={`rack-tile-wrapper-${index}`}
          className="rack__tile-wrapper"
        >
          {tiles[index] && (
            <Tile
              key={`rack-tile-${index}`}
              index={index}
              letter={tiles[index].letter}
              score={tiles[index].score}
              movable
              moveRackTiles={moveRackTiles}
            />
          )}
        </div>
      ))}
    </div>
  )
};
