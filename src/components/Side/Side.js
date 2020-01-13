import React from 'react';
import Rack from './Rack';
import Scores from './Scores';
import Actions from './Actions';

export default function Side({ rackTiles }) {
  return (
    <div className="side">
      <Scores />
      <Rack tiles={rackTiles} />
      <Actions />
    </div>
  )
};
