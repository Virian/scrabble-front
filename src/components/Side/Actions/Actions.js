import React, { useState, useContext, useEffect } from 'react';
import { ButtonGroup, Button } from '@material-ui/core'
import { GameContext } from '../../../context/GameContext';
import GameState from '../../../enum/GameState';

export default function Actions() {
  const { gameState } = useContext(GameContext);
  const [isYourTurn, setIsYourTurn] = useState(false);

  useEffect(() => {
    setIsYourTurn(gameState === GameState.PLAYING || gameState === GameState.PLAYING_FIRST_TURN);
  }, [gameState])

  return ( // TODO: maybe disable buttons depending on different situations on the board
    <div className="actions">
      <ButtonGroup disabled={!isYourTurn}>
        <Button>ułóż</Button>
        <Button>wymień</Button>
        <Button>pas</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>akceptuję</Button>
        <Button>sprawdzam</Button>
      </ButtonGroup>
    </div>
  )
}