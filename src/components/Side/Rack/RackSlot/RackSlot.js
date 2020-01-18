import React, { useRef } from 'react';
import classNames from 'classnames';
import { useDrop } from 'react-dnd';
import ItemTypes from '../../../../enum/ItemTypes';
import Tile from '../../../Tile';

export default function Rack({
  tile,
  index,
  moveRackTiles,
  toggleTileHighlight
}) {
  const ref = useRef(null);
  const [{ hovered }, drop] = useDrop({
    accept: ItemTypes.TILE,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      if (!item.isRackTile) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const horizontalLeftBreakpoint = (hoverBoundingRect.right - hoverBoundingRect.left) / 4;
      const horizontalRightBreakpoint = (hoverBoundingRect.right - hoverBoundingRect.left) * 3 / 4;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      // Only perform the move when the mouse has crossed half of the items width
      // When dragging right, only move when the cursor passed 25% of item width
      // When dragging left, only move when the cursor passed 25% of item width
      // Dragging right
      if (dragIndex < hoverIndex && hoverClientX < horizontalLeftBreakpoint) {
        return;
      }
      // Dragging left
      if (dragIndex > hoverIndex && hoverClientX > horizontalRightBreakpoint) {
        return;
      }
      moveRackTiles(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here! Generally it's better to avoid mutations,
      // but it's good here for the sake of performance to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: monitor => ({
      hovered: monitor.isOver(),
    }),
  });
  drop(ref);

  return (
    <div
      ref={ref}
      className={classNames('rack-slot', { 'rack-slot--highlighted' : hovered })}
    >
      {tile && (
        <Tile
          index={index}
          letter={tile.letter}
          score={tile.score}
          movable
          moveRackTiles={moveRackTiles}
          isRackTile
          isHighlighted={tile.isHighlighted}
          toggleTileHighlight={() => toggleTileHighlight(index)}
        />
      )}
    </div>
  )
};
