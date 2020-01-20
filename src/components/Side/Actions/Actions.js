import React, { useState, useContext, useEffect } from 'react';
import { ButtonGroup, Button } from '@material-ui/core'
import { GameContext } from '../../../context/GameContext';
import GameState from '../../../enum/GameState';

export default function Actions({
  canPlace,
  canSwap,
  onPlace,
  onHold,
  onSwap,
}) {
  const { gameState } = useContext(GameContext);
  const [isYourTurn, setIsYourTurn] = useState(false);

  useEffect(() => {
    setIsYourTurn(gameState === GameState.PLAYING || gameState === GameState.PLAYING_FIRST_TURN);
  }, [gameState])

  return (
    <div className="actions">
      <ButtonGroup disabled={!isYourTurn}>
        <Button
          disabled={!canPlace}
          onClick={onPlace}
        >ułóż</Button>
        <Button
          disabled={!canSwap}
          onClick={onSwap}
        >wymień</Button>
        <Button onClick={onHold}>pas</Button>
      </ButtonGroup>
      {gameState === GameState.WAITING_WORD_ACCEPTANCE && <ButtonGroup>
        <Button>akceptuję</Button>
        <Button>sprawdzam</Button>
      </ButtonGroup>}
    </div>
  )
}