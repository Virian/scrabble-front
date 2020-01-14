import React from 'react';
import GameState from '../enum/GameState';

const GameContext = React.createContext({
  gameState: GameState.WAITING_GAME_START,
});
export default GameContext;
