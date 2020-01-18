import React, { useMemo } from 'react';
import Square from '../Square';
import Tile from '../Tile';
import { getBonusTextAndColor } from '../../utils/bonus.utils'

export default function Board({
  boardTiles,
  bonuses,
  moveTileFromRackToBoard,
  moveTileOnBoard,
}) {
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
                  movable={tile.wasPlaced}
                  x={columnIndex}
                  y={rowIndex}
                />
              ) : null}
            </Square>
          ))
        )
      }
    </div>
  )
};
