import React from 'react';
import Rack from './Rack';
import Scores from './Scores';
import Actions from './Actions';

export default function Side({ 
  rackTiles,
  moveRackTiles,
  players,
  onHold,
}) {
  return (
    <div className="side">
      <Scores players={players} />
      <Rack
        tiles={rackTiles}
        moveRackTiles={moveRackTiles}
      />
      <Actions onHold={onHold} />
    </div>
  )
};
