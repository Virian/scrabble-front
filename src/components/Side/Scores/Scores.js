import React from 'react';
import PlayerScore from './PlayerScore';

export default function Scores(props) {
  return (
    <div className="scores">
      <PlayerScore
        name="Player 123"
        score="109"
      />
      <PlayerScore
        name="opponent1"
        score="78"
      />
    </div>
  )
};
