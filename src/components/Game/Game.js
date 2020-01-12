import React, { useEffect } from 'react';
import Board from '../Board';
import Side from '../Side';

export default function Game() {
  useEffect(() => {
    ws.onopen = () => {
      console.log('connected');
      ws.send('something');
    }

    ws.onmessage = ({ data }) => {
      console.log('message', data);
    }

    ws.onclose = () => {
      console.log('disconnected');
    }
  });

  const ws = new WebSocket('ws://localhost:3001');
  const rackTiles = [{
    letter: 'a',
    score: '1',
  }, {
    letter: 't',
    score: '2',
  }, {
    letter: 'ź',
    score: '9',
  }, {
    letter: 'o',
    score: '1',
  }, {
    letter: 'h',
    score: '3',
  }, {
    letter: 'c',
    score: '2',
  }, {
    letter: 's',
    score: '1',
  }]

  return (
    <div className="game">
      <Board />
      <Side rackTiles={rackTiles} />
    </div>
  )
};
