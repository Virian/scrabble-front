import React from 'react';
import Tile from '../../Tile';

export default function Rack({ tiles }) {
  return (
    <div className="rack-wrapper">
      <div className="rack">
        {Array(7).fill(0).map((_, index) => (
          <div
            key={`rack-tile-wrapper-${index}`}
            className="rack__tile-wrapper"
          >
            {tiles[index] && (
              <Tile
                key={`rack-tile-${index}`}
                letter={tiles[index].letter}
                score={tiles[index].score}
                movable
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
};
