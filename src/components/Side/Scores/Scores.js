import React, { useContext } from 'react';
import PlayerScore from './PlayerScore';
import { GameContext } from '../../../context/GameContext';

export default function Scores({ players }) {
  const { activePlayerIndex } = useContext(GameContext);

  return (
    <div className="scores">
      {players.map((player, index) => (
        <PlayerScore
          key={player.id}
          name={player.isYou ? 'Ty' : 'Przeciwnik'}
          score={player.score}
          isActive={activePlayerIndex === index}
        />
      ))}
    </div>
  )
};
