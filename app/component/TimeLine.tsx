import { useState, useRef, FC, useEffect } from 'react';
import type { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes, ItemTLine } from './Constants'
import { ConfigProvider, InputNumber, Input } from 'antd'

export interface TLineProps{
  itemTLine: ItemTLine;
  onTimeLineChange: (value: ItemTLine) => void;
  status: boolean;
  onStatusChange: (index: number) => void;
  moveLine: (dragIndex: number, hoverIndex: number) => void
}
 
interface DragItem {
  index: number
  id: string
  type: string
}

export const TimeLine: React.FC<TLineProps> = ({ itemTLine, onTimeLineChange, status, onStatusChange, moveLine}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
      DragItem,
      void,
      { handlerId: Identifier | null }
  >({
    accept: ItemTypes.TLINE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index;
      const hoverIndex = itemTLine.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveLine(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TLINE,
    item: () => {
      return { id: itemTLine.id, index: itemTLine.index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  // useEffect(() => {
  //     console.log('TimeLine render');
  // }, [itemTLine.time]);

  const handleTimeChange = (value: number | null, _index: number) => {
    if (value == null) return;
    switch(_index) {
      case 0: itemTLine.time.startHour = value; break;
      case 1: itemTLine.time.startMinute = value; break;
      case 2: itemTLine.time.endHour = value; break;
      case 3: itemTLine.time.endMinute = value; break;
    }
    onTimeLineChange(itemTLine);
  };

  const handleThingChange = (value: string) => {
      itemTLine.time.thing = value;
      onTimeLineChange(itemTLine);
  };

  const handleEdit = () => {
    onStatusChange(itemTLine.index);
  }

  const handleBlur = () => {
    onStatusChange(-1);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 20,
        },
    }}>
      <div ref={ref} style={{ opacity, display: 'flex', alignItems: 'center' }} 
        data-handler-id={handlerId} onClick={handleEdit} onBlur={handleBlur}>
        {status ? 
          <>
            <InputNumber min={0} max={23} value={itemTLine.time.startHour}
              onChange={e => (handleTimeChange(e, 0))} onBlur={(e) => e.stopPropagation()} changeOnWheel />
            <span>:</span>
            <InputNumber min={0} max={59} value={itemTLine.time.startMinute}
              onChange={e => (handleTimeChange(e, 1))} onBlur={(e) => e.stopPropagation()} changeOnWheel />
            <span>~</span>
            <InputNumber min={0} max={23} value={itemTLine.time.endHour}
              onChange={e => (handleTimeChange(e, 2))} onBlur={(e) => e.stopPropagation()} changeOnWheel />
            <span>:</span>
            <InputNumber min={0} max={59} value={itemTLine.time.endMinute}
              onChange={e => (handleTimeChange(e, 3))} onBlur={(e) => e.stopPropagation()} changeOnWheel />
            <span>-</span>
            <Input placeholder='Basic usage' value={itemTLine.time.thing}
              onChange={e => (handleThingChange(e.target.value))} onBlur={(e) => e.stopPropagation()} autoFocus />
          </>
        : (
          <>
            <span>{itemTLine.time.startHour}:{itemTLine.time.startMinute} ~ {itemTLine.time.endHour}
              :{itemTLine.time.endMinute} - {itemTLine.time.thing}</span>
          </>
        )}
      </div>
    </ConfigProvider>
  );
}