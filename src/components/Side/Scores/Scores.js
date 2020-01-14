import React from 'react';
import PlayerScore from './PlayerScore';

export default function Scores({ players }) {
  return (
    <div className="scores">
      {players.map(player => (
        <PlayerScore
          key={player.id}
          name={player.isYou ? 'Ty' : 'Przeciwnik'}
          score={player.score}
        />
      ))}
    </div>
  )
};
