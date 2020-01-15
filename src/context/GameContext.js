import React, { useState } from 'react';
import GameState from '../enum/GameState';

export const GameContext = React.createContext(null);

export const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState(GameState.WAITING_GAME_START);
  const [userId, setUserId] = useState(null);
  const [activePlayerIndex, setActivePlayerIndex] = useState(-1);

  return (
    <GameContext.Provider value={{
      gameState,
      setGameState,
      userId,
      setUserId,
      activePlayerIndex,
      setActivePlayerIndex,
    }}>
      {children}
    </GameContext.Provider>
  )
};
