import { useState, useRef, FC, useEffect } from 'react';
import type { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes, ItemTLine, Label } from './Constants'
import { ConfigProvider, InputNumber, Input, AutoComplete } from 'antd'

export interface TLineProps {
  itemTLine: ItemTLine;
  onTimeLineChange: (value: ItemTLine) => void;
  status: boolean;
  onStatusChange: (index: number) => void;
  moveLine: (dragIndex: number, hoverIndex: number) => void;
  option: Label[];
}

interface DragItem {
  index: number
  id: string
  type: string
}

export const TimeLine: React.FC<TLineProps> = ({ itemTLine, onTimeLineChange, status, onStatusChange, moveLine, option }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [thing, setThing] = useState<string>(itemTLine.time.thing);

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
    switch (_index) {
      case 0: itemTLine.time.startHour = value; break;
      case 1: itemTLine.time.startMinute = value; break;
      case 2: itemTLine.time.endHour = value; break;
      case 3: itemTLine.time.endMinute = value; break;
    }
    onTimeLineChange(itemTLine);
  };

  const handleThingChange = () => {
    itemTLine.time.thing = thing;
    onTimeLineChange(itemTLine);
  };

  const handleEdit = () => {
    onStatusChange(itemTLine.index);
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      onStatusChange(-1);
    }
  };

  return (
    <div ref={ref} style={{ opacity, display: 'flex', alignItems: 'center' }}
      data-handler-id={handlerId} onClick={handleEdit} onBlur={handleBlur}>
      {status ?
        <>
          <InputNumber min={0} max={23} value={itemTLine.time.startHour} className="w-1/8"
            onChange={e => (handleTimeChange(e, 0))} changeOnWheel />
          <span>:</span>
          <InputNumber min={0} max={59} value={itemTLine.time.startMinute}
            onChange={e => (handleTimeChange(e, 1))} changeOnWheel />
          <span>~</span>
          <InputNumber min={0} max={23} value={itemTLine.time.endHour}
            onChange={e => (handleTimeChange(e, 2))} changeOnWheel />
          <span>:</span>
          <InputNumber min={0} max={59} value={itemTLine.time.endMinute}
            onChange={e => (handleTimeChange(e, 3))} changeOnWheel />
          <span>-</span>
          <AutoComplete options={option} value={thing} style={{ width: 100 }} className="h-full"
            onBlur={handleThingChange} onChange={e => setThing(e)} autoFocus 
            filterOption={(inputValue, option) => option!.value.indexOf(inputValue) !== -1}/>
        </>
        : (
          <>
            <span>{itemTLine.time.startHour}:{itemTLine.time.startMinute} ~ {itemTLine.time.endHour}
              :{itemTLine.time.endMinute} - {itemTLine.time.thing}</span>
          </>
        )}
    </div>
  );
}