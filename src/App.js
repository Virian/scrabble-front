import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Game from './components/Game';
import { GameContextProvider } from './context/GameContext';

function App() {
  return (
    <div className="App">
      <DndProvider backend={Backend}>
        <GameContextProvider>
          <Game />
        </GameContextProvider>
      </DndProvider>
    </div>
  );
}

export default App;
