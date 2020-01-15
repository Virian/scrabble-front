import React, { useState, useEffect } from 'react';
import Square from '../Square';
import Tile from '../Tile';
import { getBonusTextAndColor } from '../../utils/bonus.utils'

export default function Board({ boardTiles, bonuses }) {
  const [board, setBoard] = useState([]);
  
  useEffect(() => {
    let tempBoard = boardTiles.map(row => {
      return row.map(square => ({ square, bonus: null }));
    });
    bonuses.forEach(bonus => {
      tempBoard[bonus.y][bonus.x].bonus = {
        ...bonus,
        ...getBonusTextAndColor(bonus),
      }
    })
    setBoard(tempBoard)
  }, [boardTiles, bonuses]);

  return (
    <div className="board">
      {
        board.map((row, rowIndex) =>
          row.map(({ bonus, tile }, columnIndex) => (
            <Square 
              key={`square-${rowIndex}-${columnIndex}`}
              bonus={bonus}
            >
              {tile && <Tile letter={tile.letter} score={tile.score} />}
            </Square>
          ))
        )
      }
    </div>
  )
};
