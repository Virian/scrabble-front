import React, { useEffect } from 'react';

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
    <span>gierka</span>
  )
};
