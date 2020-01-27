import React, { 
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { sortBy, range } from 'lodash-es'
import Board from '../Board';
import Side from '../Side';
import Message from '../../models/Message';
import Player from '../../models/Player';
import MessageTypes from '../../enum/MessageTypes';
import GameState from '../../enum/GameState';
import { GameContext } from '../../context/GameContext';
import { isPropertyEqual } from '../../utils/array.utils';

export default function Game() {
  const { 
    gameState,
    setGameState,
    setActivePlayerIndex,
    setUserId,
  } = useContext(GameContext);

  const [ws, setWs] = useState(null);
  const [board, setBoard] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [rackTiles, setRackTiles] = useState(Array(7).fill(null));
  const [players, setPlayers] = useState([]);

  const tilesPlaced = useMemo(() => {
    return board.reduce((tiles, row, rowIndex) => {
      const placed = row.reduce((tilesInRow, tile, columnIndex) => {
        if (tile?.wasPlaced) {
          return [...tilesInRow, {
            ...tile,
            x: columnIndex,
            y: rowIndex,
          }]
        } else {
          return tilesInRow
        }
      }, []);
      return [...tiles, ...placed]
    }, []);
  }, [board]);

  const canPlace = useMemo(() => {
    if (tilesPlaced.length === 0 ||
      (tilesPlaced.length === 1 && gameState === GameState.PLAYING_FIRST_TURN)) {
      return false;
    } else {
      // check if tiles are placed in one dimension
      const areHorizontal = isPropertyEqual(tilesPlaced, 'y');
      const areVertical = isPropertyEqual(tilesPlaced, 'x');
      const consecutiveIndexes = tilesPlaced
        .map((tile) => areHorizontal ? tile.x : tile.y)
        .sort((a, b) => a - b);
      if (!areHorizontal && !areVertical) {
        return false;
      } else if (gameState === GameState.PLAYING_FIRST_TURN) {
        // check if there is no space between letters and if there is a tile on the board center
        const isOnCenter = !!tilesPlaced.find((tile) => tile.x === 7 && tile.y === 7);
        const differences = consecutiveIndexes.slice(1).map((index, i) => index - consecutiveIndexes[i]);
        const areInLine = differences.every((diff) => diff === 1);
        return areInLine && isOnCenter;
      } else if (gameState === GameState.PLAYING) {
        const areAdjacent = tilesPlaced.some(({ x , y}) => {
          const hasTopConnected = y === 0 ? false : board[y - 1][x] && !board[y - 1][x].wasPlaced;
          const hasRightConnected = x === board[0].length ? false : !!board[y][x + 1] && !board[y][x + 1].wasPlaced;
          const hasBottomConnected = y === board.length ? false : !!board[y + 1][x] && !board[y + 1][x].wasPlaced;;
          const hasLeftConnected = x === 0 ? false : !!board[y][x - 1] && !board[y][x - 1].wasPlaced;;
          return hasTopConnected || hasRightConnected || hasBottomConnected || hasLeftConnected;
        });
        const indexesToFill = range(consecutiveIndexes[0], consecutiveIndexes[consecutiveIndexes.length - 1] + 1);
        const { x, y } = tilesPlaced[0];
        const areContinuous = indexesToFill.every((index) => areHorizontal ? !!board[y][index] : !!board[index][x]);
        return areAdjacent && areContinuous
      } else {
        return false;
      }
    }
  }, [tilesPlaced, gameState, board])

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
        setRackTiles((currentRack) => {
          const rackCopy = currentRack.slice();
          newTiles.forEach((tile) => {
            const index = rackCopy.findIndex((rackTile) => !rackTile);
            rackCopy[index] = tile;
          });
          return rackCopy;
        });
        break;
      case MessageTypes.NOTIFY_START:
        setActivePlayerIndex(0);
        setPlayers((currentPlayers) => {
          let newPlayers = currentPlayers.slice();
          newPlayers.forEach((player, index) => {
            const matchingPlayerData = messageObj.data.find(data => data.id === player.id);
            newPlayers[index].order = matchingPlayerData.order;
          });
          newPlayers = sortBy(newPlayers, 'order');
          setGameState(newPlayers[0].isYou ? GameState.PLAYING_FIRST_TURN : GameState.WAITING_OPPONENT);
          return newPlayers
        });
        break;
      case MessageTypes.AWAITING_OTHERS_ACCEPTANCE:
        setGameState(GameState.WAITING_OTHERS_WORD_ACCEPTANCE);
        break;
      case MessageTypes.AWAITING_ACCEPTANCE:
        setGameState(GameState.WAITING_WORD_ACCEPTANCE);
        setBoard((currentBoard) => {
          const boardCopy = currentBoard.slice();
          messageObj.data.forEach(({ letter, score, isBlank, x, y }) => {
            boardCopy[y][x] = {
              letter,
              score,
              isBlank,
              isHighlighted: false,
              wasPlaced: true,
            }
          })
          return boardCopy;
        });
        break;
      case MessageTypes.UPDATE_SCORE:
        setPlayers((currentPlayers) => {
          const { playerId, score } = messageObj.data;
          const playersCopy = currentPlayers.slice();
          const indexToUpdate = playersCopy.findIndex((player) => player.id === playerId);
          playersCopy[indexToUpdate].score += score;
          return playersCopy;
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
        setBoard((currentBoard) => {
          return currentBoard.map((row) => {
            return row.map((square) => {
              if (square) {
                return {
                  ...square,
                  wasPlaced: false,
                };
              } else {
                return square;
              }
            });
          });
        });
        setActivePlayerIndex((currentIndex) => {
          return (currentIndex + 1) % players.length;
        });
        break;
      case MessageTypes.YOUR_TURN:
        setBoard((currentBoard) => {
          return currentBoard.map((row) => {
            return row.map((square) => {
              if (square) {
                return {
                  ...square,
                  wasPlaced: false,
                };
              } else {
                return square;
              }
            });
          });
        });
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
      const rackCopy = currentRack.slice();
      rackCopy[hoverIndex] = rackCopy.splice(dragIndex, 1, rackCopy[hoverIndex])[0];
      return rackCopy;
    });
  };

  const moveTileFromRackToBoard = (rackIndex, boardX, boardY) => {
    const tile = rackTiles[rackIndex];
    tile.isHighlighted = false;
    tile.wasPlaced = true;
    setRackTiles((currentRack) => {
      const rackCopy = currentRack.slice();
      rackCopy[rackIndex] = null;
      return rackCopy;
    });
    setBoard((currentBoard) => {
      const boardCopy = currentBoard.slice();
      boardCopy[boardY][boardX] = tile;
      return boardCopy;
    });
  };

  const moveTileOnBoard = ({ sourceX, sourceY, targetX, targetY }) => {
    setBoard((currentBoard) => {
      const boardCopy = currentBoard.slice();
      const tile = boardCopy[sourceY][sourceX];
      boardCopy[sourceY][sourceX] = null;
      boardCopy[targetY][targetX] = tile;
      return boardCopy;
    })
  };

  const moveTileFromBoardToRack = (rackIndex, boardX, boardY) => {
    const tile = board[boardY][boardX];
    tile.wasPlaced = false;
    setBoard((currentBoard) => {
      const boardCopy = currentBoard.slice();
      boardCopy[boardY][boardX] = null;
      return boardCopy;
    });
    setRackTiles((currentRack) => {
      const rackCopy = currentRack.slice();
      rackCopy[rackIndex] = tile;
      return rackCopy;
    })
  };

  const onPlace = () => {
    const tilesToSend = tilesPlaced.map(({ letter, score, isBlank, x, y }) => ({
      letter,
      score,
      isBlank,
      x,
      y,
    }))
    ws.send(JSON.stringify(new Message({ type: MessageTypes.PLACE, data: tilesToSend })));
  };

  const onSwap = () => {
    setRackTiles((currentRack) => {
      const lettersToSwap = currentRack
        .filter((tile) => tile?.isHighlighted)
        .map((tile) => tile.letter);
      const newRack = currentRack.filter((tile) => !tile?.isHighlighted);
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

  const onAccept = () => {
    ws.send(JSON.stringify(new Message({ type: MessageTypes.WORD_ACCEPT })));
    setGameState(GameState.WAITING_OTHERS_WORD_ACCEPTANCE);
  }

  const onCheck = () => {
    ws.send(JSON.stringify(new Message({ type: MessageTypes.WORD_CHECK })));
  }

  const toggleTileHighlight = (index) => {
    setRackTiles((currentRack) => {
      let rackCopy = currentRack.slice();
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
        moveTileOnBoard={moveTileOnBoard}
      />
      <Side
        rackTiles={rackTiles}
        moveRackTiles={moveRackTiles}
        moveTileFromBoardToRack={moveTileFromBoardToRack}
        players={players}
        canPlace={canPlace}
        onPlace={onPlace}
        onAccept={onAccept}
        onCheck={onCheck}
        onSwap={onSwap}
        onHold={onHold}
        toggleTileHighlight={toggleTileHighlight}
      />
    </div>
  );
};
