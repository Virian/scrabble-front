import React, { useEffect, useState, useContext } from 'react';
import { sortBy } from 'lodash-es'
import Board from '../Board';
import Side from '../Side';
import Message from '../../models/Message';
import Player from '../../models/Player';
import MessageTypes from '../../enum/MessageTypes';
import GameContext from '../../context/GameContext';

export default function Game() {
  const { gameState } = useContext(GameContext);

  const [ws, setWs] = useState(null);
  const [board, setBoard] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [rackTiles, setRackTiles] = useState([]);
  const [players, setPlayers] = useState([]);

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
      case MessageTypes.SEND_PLAYERS: {
        const newPlayers = messageObj.data.map((player) => new Player(player));
        setPlayers(newPlayers);
        break;
      }
      case MessageTypes.PLAYER_CONNECTED: {
        const newPlayer = new Player({
          id: messageObj.data,
          isYou: false,
        });
        setPlayers((currentPlayers) => [...currentPlayers, newPlayer]);
        break;
      }
      case MessageTypes.PLAYER_ORDER: {
        setPlayers((currentPlayers) => {
          let newPlayers = currentPlayers.slice(0);
          newPlayers.forEach((player, index) => {
            const matchingPlayerData = messageObj.data.find(data => data.id === player.id);
            newPlayers[index].order = matchingPlayerData.order;
          });
          return sortBy(newPlayers, 'order');
        });
        break;
      }
      case MessageTypes.ADD_TILES:
        setRackTiles(messageObj.data);
        break;
      default:
        break;
    }
  }

  return (
    <div className="game">
      <Board
        boardTiles={board}
        bonuses={bonuses}
      />
      <Side
        rackTiles={rackTiles}
        players={players}
      />
    </div>
  )
};
