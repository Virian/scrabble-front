import React from 'react';
import RackSlot from './RackSlot';

export default function Rack({
  tiles,
  moveRackTiles,
  moveTileFromBoardToRack,
  toggleTileHighlight,
}) {
  return (
    <div className="rack">
      {Array(7).fill(0).map((_, index) => (
        <RackSlot
          key={`rack-slot-${index}`}
          tile={tiles[index]}
          index={index}
          moveRackTiles={moveRackTiles}
          moveTileFromBoardToRack={moveTileFromBoardToRack}
          toggleTileHighlight={toggleTileHighlight}
        />
      ))}
    </div>
  )
};
