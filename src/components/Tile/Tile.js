import React, { useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from '../../enum/ItemTypes';

// TODO: simplify with useDrag and useDrop

const Tile = React.forwardRef(
  ({ 
    letter,
    score,
    movable,
    isDragging,
    connectDragSource,
    connectDropTarget,
  }, ref) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));
  
    return (
      <div
        ref={elementRef}
        className={classNames('tile', { 'tile--movable': movable })}
      >
        <span className="tile__letter">{letter}</span>
        {score ? <span className="tile__score">{score}</span> : null}
      </div>
    )
  }
)

export default DropTarget(
  ItemTypes.TILE,
  {
    hover({ index, moveRackTiles }, monitor, component) {
      if (!component) return null;
      // node = HTML Div element from imperative API
      const node = component.getNode();
      if (!node) return null;
      const dragIndex = monitor.getItem().index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;
      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect();
      // Get horizontal middle
      const horizontalLeftBreakPoint = (hoverBoundingRect.right - hoverBoundingRect.left) / 3;
      const horizontalRightBreakPoint = (hoverBoundingRect.right - hoverBoundingRect.left) * 2 / 3;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      // Only perform the move when the mouse has crossed half of the items width
      // When dragging right, only move when the cursor passed 33% of item width
      // When dragging left, only move when the cursor passed 33% of item width
      // Dragging right
      if (dragIndex < hoverIndex && hoverClientX < horizontalLeftBreakPoint) return;
      // Dragging left
      if (dragIndex > hoverIndex && hoverClientX > horizontalRightBreakPoint) return;
      // Time to actually perform the action
      moveRackTiles(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    },
  },
  connect => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    ItemTypes.TILE,
    {
      beginDrag: props => ({
        id: props.id,
        index: props.index,
      }),
      canDrag: props => props.movable,
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(Tile),
);
