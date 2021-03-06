import React, { useContext } from 'react';
import classNames from 'classnames';
import { useDrop } from 'react-dnd';
import ItemTypes from '../../enum/ItemTypes';
import GameState from '../../enum/GameState';
import { GameContext } from '../../context/GameContext';

export default function Square({
  children,
  bonus,
  moveTileFromRackToBoard,
  moveTileOnBoard,
  x,
  y,
}) {
  const { gameState } = useContext(GameContext);

  const [{ hovered }, drop] = useDrop({
    accept: ItemTypes.TILE,
    drop: (item) => {
      if (item.isRackTile) {
        moveTileFromRackToBoard(item.index, x, y);
      } else {
        moveTileOnBoard({
          sourceX: item.x,
          sourceY: item.y,
          targetX: x,
          targetY: y,
        });
      }
    },
    collect: monitor => ({
      hovered: monitor.isOver(),
    }),
    canDrop: () => {
      return (!children || children.length === 0) &&
        (gameState === GameState.PLAYING || gameState === GameState.PLAYING_FIRST_TURN);
    }
  });

  return (
    <div
      ref={drop}
      className={classNames('square', bonus ? `square--${bonus.color}` : null)}
    >
      {hovered ? <div className="square__overlay" /> : null}
      {bonus ? (
        <span className="square__bonus-text">{bonus.text}</span>
      ) : null}
      {children}
    </div>
  )
};
