import React from 'react';
import Rack from './Rack';
import Scores from './Scores';
import Actions from './Actions';

export default function Side({ rackTiles, players }) {
  return (
    <div className="side">
      <Scores players={players} />
      <Rack tiles={rackTiles} />
      <Actions />
    </div>
  )
};
