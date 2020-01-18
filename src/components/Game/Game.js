import React, { useEffect, useState, useContext, useCallback } from 'react';
import { sortBy } from 'lodash-es'
import Board from '../Board';
import Side from '../Side';
import Message from '../../models/Message';
import Player from '../../models/Player';
import MessageTypes from '../../enum/MessageTypes';
import GameState from '../../enum/GameState';
import { GameContext } from '../../context/GameContext';

export default function Game() {
  const { 
    setGameState,
    setActivePlayerIndex,
    setUserId,
  } = useContext(GameContext);

  const [ws, setWs] = useState(null);
  const [board, setBoard] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [rackTiles, setRackTiles] = useState(Array(7).fill(null));
  const [players, setPlayers] = useState([]);

  const handleMessage = useCallback((message) => {
    const messageObj = new Message(JSON.parse(message));
    console.log(messageObj);
    switch (messageObj.type) {
      case MessageTypes.SEND_BOARD:
        setBoard(messageObj.data.board);
        setBonuses(messageObj.data.bonuses);
        break;
      case MessageTypes.SEND_PLAYERS: {
        const newPlayers = messageObj.data.map((player) => new Player(player));
        const user = newPlayers.find((player) => player.isYou);
        setUserId(user.id);
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
      case MessageTypes.ADD_TILES:
        const newTiles = messageObj.data.map((tile) => ({
          ...tile,
          isHighlighted: false,
        }));
        setRackTiles(newTiles);
        break;
      case MessageTypes.NOTIFY_START:
        setActivePlayerIndex(0);
        setPlayers((currentPlayers) => {
          let newPlayers = currentPlayers.slice(0);
          newPlayers.forEach((player, index) => {
            const matchingPlayerData = messageObj.data.find(data => data.id === player.id);
            newPlayers[index].order = matchingPlayerData.order;
          });
          newPlayers = sortBy(newPlayers, 'order');
          setGameState(newPlayers[0].isYou ? GameState.PLAYING_FIRST_TURN : GameState.WAITING_OPPONENT);
          return newPlayers
        });
        break;
      case MessageTypes.SWAP_ACCEPTED:
        setRackTiles(currentRack => {
          const newTiles = messageObj.data.map((tile) => ({
            ...tile,
            isHighlighted: false,
          }));
          return [...currentRack, ...newTiles]
        });
        setActivePlayerIndex((currentIndex) => {
          return (currentIndex + 1) % players.length;
        });
        setGameState(GameState.WAITING_OPPONENT);
        break;
      case MessageTypes.SWAP_CANCELLED:
        // TODO: display information about unsuccessful swap
        break;
      case MessageTypes.NEXT_PLAYER:
        setActivePlayerIndex((currentIndex) => {
          return (currentIndex + 1) % players.length;
        });
        break;
      case MessageTypes.YOUR_TURN:
        setActivePlayerIndex(players.findIndex(player => player.isYou));
        setGameState(GameState.PLAYING);
        break;
      default:
        break;
    }
  }, [
    setActivePlayerIndex,
    setGameState,
    setUserId,
    players,
  ]);

  const moveRackTiles = (dragIndex, hoverIndex) => {
    setRackTiles((currentRack) => {
      let rackCopy = currentRack.slice(0);
      rackCopy[hoverIndex] = rackCopy.splice(dragIndex, 1, rackCopy[hoverIndex])[0];
      return rackCopy;
    });
  };

  const moveTileFromRackToBoard = (rackIndex, boardX, boardY) => {
    const tile = rackTiles[rackIndex];
    setRackTiles((currentRack) => {
      const rackCopy = currentRack.slice(0);
      rackCopy[rackIndex] = null;
      return rackCopy;
    });
    setBoard((currentBoard) => {
      const boardCopy = currentBoard.slice(0);
      boardCopy[boardY][boardX] = tile;
      return boardCopy;
    });
  }

  const onSwap = () => {
    setRackTiles((currentRack) => {
      const lettersToSwap = currentRack
        .filter((tile) => tile.isHighlighted)
        .map((tile) => tile.letter);
      const newRack = currentRack.filter((tile) => !tile.isHighlighted);
      ws.send(JSON.stringify(new Message({ type: MessageTypes.SWAP, data: lettersToSwap })));
      return newRack;
    });
  };

  const onHold = () => {
    ws.send(JSON.stringify(new Message({ type: MessageTypes.HOLD })));
    setActivePlayerIndex((currentIndex) => {
      return (currentIndex + 1) % players.length;
    });
    setGameState(GameState.WAITING_OPPONENT);
  };

  const toggleTileHighlight = (index) => {
    setRackTiles((currentRack) => {
      let rackCopy = currentRack.slice(0);
      rackCopy[index].isHighlighted = !rackCopy[index].isHighlighted;
      return rackCopy;
    })
  }

  useEffect(() => {
    setWs(new WebSocket('ws://localhost:3001'))
  }, []);

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
  }, [ws, handleMessage]);

  return (
    <div className="game">
      <Board
        boardTiles={board}
        bonuses={bonuses}
        moveTileFromRackToBoard={moveTileFromRackToBoard}
      />
      <Side
        rackTiles={rackTiles}
        moveRackTiles={moveRackTiles}
        players={players}
        onSwap={onSwap}
        onHold={onHold}
        toggleTileHighlight={toggleTileHighlight}
      />
    </div>
  );
};
