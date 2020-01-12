import React, { useState, useEffect } from 'react';
import Square from '../Square';
import Tile from '../Tile';
import { getBonusTextAndColor } from '../../utils/bonus.utils'

export default function Board(props) {
  const [board, setBoard] = useState([]);
  useEffect(() => {
    let tempBoard = props.board.map(row => {
      return row.map(square => ({ square, bonus: null }));
    });
    props.bonuses.forEach(bonus => {
      tempBoard[bonus.y][bonus.x].bonus = {
        ...bonus,
        ...getBonusTextAndColor(bonus),
      }
    })
    setBoard(tempBoard)
  }, [props.board, props.bonuses]);



  return (
    <div className="board">
      {
        board.map((row, rowIndex) =>
          row.map((square, columnIndex) => (
            <Square 
              key={`square-${rowIndex}-${columnIndex}`}
              bonus={square.bonus}
            >
              {square.tile && <Tile letter={square.tile.letter} score={square.tile.score} />}
            </Square>
          ))
        )
      }
    </div>
  )
};
