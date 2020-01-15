import React, { useState, useEffect } from 'react';
import GameState from '../enum/GameState';

export const GameContext = React.createContext(null);

export const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState(GameState.WAITING_GAME_START);
  const [userId, setUserId] = useState(null);
  const [activePlayerIndex, setActivePlayerIndex] = useState(-1);

  useEffect(() => {
    if (gameState === GameState.PLAYING || gameState === GameState.PLAYING_FIRST_TURN) { // TODO: later there may be more game states to consider
      document.title = '\u25b6Scrabble'
    } else {
      document.title = 'Scrabble'
    }
  }, [gameState])

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
