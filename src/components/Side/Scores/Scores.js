import React, { useContext, useCallback } from 'react';
import PlayerScore from './PlayerScore';
import { GameContext } from '../../../context/GameContext';
import GameState from '../../../enum/GameState'

export default function Scores({ players }) {
  const { activePlayerIndex, gameState } = useContext(GameContext);

  const isActive = useCallback((index) => {
    if (gameState === GameState.WAITING_OTHERS_WORD_ACCEPTANCE || gameState === GameState.WAITING_WORD_ACCEPTANCE) {
      return index !== activePlayerIndex;
    } else {
      return index === activePlayerIndex;
    }
  }, [gameState, activePlayerIndex]);

  return (
    <div className="scores">
      {players.map((player, index) => (
        <PlayerScore
          key={player.id}
          name={player.isYou ? 'Ty' : 'Przeciwnik'}
          score={player.score}
          isActive={isActive(index)}
        />
      ))}
    </div>
  )
};
