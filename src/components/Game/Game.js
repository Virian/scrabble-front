import React, { useEffect, useState } from 'react';
import Board from '../Board';
import Side from '../Side';
import Message from '../../models/Message';
import MessageTypes from '../../enum/MessageTypes';

export default function Game() {
  const [ws, setWs] = useState(null);
  const [board, setBoard] = useState([]);
  const [bonuses, setBonuses] = useState([]);

  useEffect(() => {
    setWs(new WebSocket('ws://localhost:3001'))
  }, [])

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log('connected');
      }
      ws.onmessage = ({ data }) => {
        handleMessage(data);
      }
      ws.onclose = () => {
        console.log('disconnected');
      }
    }
  }, [ws]);

  const handleMessage = (message) => {
    const messageObj = new Message(JSON.parse(message));
    console.log(messageObj);
    switch (messageObj.type) {
      case MessageTypes.SEND_BOARD:
        setBoard(messageObj.data.board);
        setBonuses(messageObj.data.bonuses);
        break;
      default:
        break;
    }
  }

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
      <Board
        boardTiles={board}
        bonuses={bonuses}
      />
      <Side rackTiles={rackTiles} />
    </div>
  )
};
