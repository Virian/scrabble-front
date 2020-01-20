import React, { useMemo, useContext, useCallback } from 'react';
import Square from '../Square';
import Tile from '../Tile';
import { getBonusTextAndColor } from '../../utils/bonus.utils';
import { GameContext } from '../../context/GameContext';
import GameState from '../../enum/GameState';

export default function Board({
  boardTiles,
  bonuses,
  moveTileFromRackToBoard,
  moveTileOnBoard,
}) {
  const { gameState } = useContext(GameContext);

  const board = useMemo(() => {
    let tempBoard = boardTiles.map(row => {
      return row.map(tile => ({ tile, bonus: null }));
    });
    bonuses.forEach(bonus => {
      tempBoard[bonus.y][bonus.x].bonus = {
        ...bonus,
        ...getBonusTextAndColor(bonus),
      }
    })
    return tempBoard
  }, [boardTiles, bonuses]);

  const isMovable = useCallback((wasPlaced) => {
    return (gameState === GameState.PLAYING || gameState === GameState.PLAYING_FIRST_TURN) &&
      wasPlaced;
  }, [gameState]);

  const shouldBlink = useCallback((wasPlaced) => {
    return (gameState === GameState.WAITING_OTHERS_WORD_ACCEPTANCE || gameState === GameState.WAITING_WORD_ACCEPTANCE) &&
      wasPlaced;
  }, [gameState]);

  return (
    <div className="board">
      {
        board.map((row, rowIndex) =>
          row.map(({ bonus, tile }, columnIndex) => (
            <Square 
              key={`square-${rowIndex}-${columnIndex}`}
              bonus={bonus}
              moveTileFromRackToBoard={moveTileFromRackToBoard}
              moveTileOnBoard={moveTileOnBoard}
              x={columnIndex}
              y={rowIndex}
            >
              {tile ? (
                <Tile
                  letter={tile.letter}
                  score={tile.score}
                  movable={isMovable(tile.wasPlaced)}
                  x={columnIndex}
                  y={rowIndex}
                  blink={shouldBlink(tile.wasPlaced)}
                />
              ) : null}
            </Square>
          ))
        )
      }
    </div>
  )
};
