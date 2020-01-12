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
  board[0][3].bonus = { color: 'paleblue', text: 'L2' };
  board[0][7].bonus = { color: 'red', text: 'S3' };
  board[0][11].bonus = { color: 'paleblue', text: 'L2' };
  board[0][14].bonus = { color: 'red', text: 'S3' };
  board[1][1].bonus = { color: 'pink', text: 'S2' };
  board[1][5].bonus = { color: 'blue', text: 'L3' };
  board[1][9].bonus = { color: 'blue', text: 'L3' };
  board[1][13].bonus = { color: 'pink', text: 'S2' };
  board[2][2].bonus = { color: 'pink', text: 'S2' };
  board[2][12].bonus = { color: 'pink', text: 'S2' };
  board[3][3].bonus = { color: 'pink', text: 'S2' };
  board[3][11].bonus = { color: 'pink', text: 'S2' };
  board[4][4].bonus = { color: 'pink', text: 'S2' };
  board[4][10].bonus = { color: 'pink', text: 'S2' };
  board[7][0].bonus = { color: 'red', text: 'S3' };
  board[7][7].bonus = { color: 'pink', text: 'S2' };
  board[7][14].bonus = { color: 'red', text: 'S3' };
  board[10][4].bonus = { color: 'pink', text: 'S2' };
  board[10][10].bonus = { color: 'pink', text: 'S2' };
  board[11][3].bonus = { color: 'pink', text: 'S2' };
  board[11][11].bonus = { color: 'pink', text: 'S2' };
  board[12][2].bonus = { color: 'pink', text: 'S2' };
  board[12][12].bonus = { color: 'pink', text: 'S2' };
  board[13][1].bonus = { color: 'pink', text: 'S2' };
  board[13][13].bonus = { color: 'pink', text: 'S2' };
  board[14][0].bonus = { color: 'red', text: 'S3' };
  board[14][3].bonus = { color: 'paleblue', text: 'L2' };
  board[14][7].bonus = { color: 'red', text: 'S3' };
  board[14][11].bonus = { color: 'paleblue', text: 'L2' };
  board[14][14].bonus = { color: 'red', text: 'S3' };
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
