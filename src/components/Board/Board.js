import React from 'react';
import Square from '../Square';
import Tile from '../Tile';

export default function Board() {
  let board = new Array(15);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(15);
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = {
        tile: null,
        bonus: null,
      }
    }
  }
  board[2][4].tile = { letter: 'a', score: '1' };
  board[0][0].bonus = { color: 'red', text: 'S3' };
  console.log(board);

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
