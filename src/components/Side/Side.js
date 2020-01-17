import React, { useMemo } from 'react';
import Rack from './Rack';
import Scores from './Scores';
import Actions from './Actions';

export default function Side({ 
  rackTiles,
  moveRackTiles,
  players,
  onSwap,
  onHold,
  toggleTileHighlight,
}) {
  const canSwap = useMemo(() => {
    return !!rackTiles.find((tile) => tile?.isHighlighted);
  }, [rackTiles]);

  return (
    <div className="side">
      <Scores players={players} />
      <Rack
        tiles={rackTiles}
        moveRackTiles={moveRackTiles}
        toggleTileHighlight={toggleTileHighlight}
      />
      <Actions
        canSwap={canSwap}
        onSwap={onSwap}
        onHold={onHold}
      />
    </div>
  )
};
