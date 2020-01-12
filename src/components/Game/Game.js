import React, { useEffect } from 'react';
import Board from '../Board';

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

  return (
    <div className="game">
      <Board />
    </div>
  )
};
