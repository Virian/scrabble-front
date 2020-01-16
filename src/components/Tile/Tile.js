import React, { useRef } from 'react';
import classNames from 'classnames';
import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from '../../enum/ItemTypes';

export default function Tile({
  letter,
  score,
  movable,
  index,
  moveRackTiles,
  isRackTile,
  isHighlighted,
  toggleTileHighlight,
}) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.TILE,
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const horizontalLeftBreakpoint = (hoverBoundingRect.right - hoverBoundingRect.left) / 3;
      const horizontalRightBreakpoint = (hoverBoundingRect.right - hoverBoundingRect.left) * 2 / 3;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      // Only perform the move when the mouse has crossed half of the items width
      // When dragging right, only move when the cursor passed 33% of item width
      // When dragging left, only move when the cursor passed 33% of item width
      // Dragging right
      if (dragIndex < hoverIndex && hoverClientX < horizontalLeftBreakpoint) return;
      // Dragging left
      if (dragIndex > hoverIndex && hoverClientX > horizontalRightBreakpoint) return;
      moveRackTiles(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here! Generally it's better to avoid mutations,
      // but it's good here for the sake of performance to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [, drag] = useDrag({
    item: { type: ItemTypes.TILE, index },
    canDrag: () => movable,
  });
  drag(drop(ref));

  const highlightTile = () => {
    if (!isRackTile) return;
    toggleTileHighlight();
  }

  return (
    <div
      ref={ref}
      className={classNames('tile', { 'tile--movable': movable })}
      onClick={highlightTile}
    >
      {isHighlighted ? <div className="tile__overlay" /> : null}
      <span className="tile__letter">{letter}</span>
      {score ? <span className="tile__score">{score}</span> : null}
    </div>
  )
};
