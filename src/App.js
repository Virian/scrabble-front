import React from 'react';
import Game from './components/Game';
import { GameContextProvider } from './context/GameContext';

function App() {
  return (
    <div className="App">
      <GameContextProvider>
        <Game />
      </GameContextProvider>
    </div>
  );
}

export default App;
