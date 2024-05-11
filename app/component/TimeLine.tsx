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
  const [inputStartHour, setInputStartHour] = useState<number>(itemTLine.time.startHour);
  const [inputEndHour, setInputEndHour] = useState<number>(itemTLine.time.endHour);
  const [inputStartMinute, setInputStartMinute] = useState<number>(itemTLine.time.startMinute);
  const [inputEndMinute, setInputEndMinute] = useState<number>(itemTLine.time.endMinute);
  const [inputThing, setInputThing] = useState<string>(itemTLine.time.thing);
  const [type, setType] = useState<boolean[]>(new Array(5).fill(false));

  const ref = useRef<HTMLDivElement>(null)
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
    setInputStartHour(value);
    onTimeLineChange(itemTLine);
  };

  const handleThingChange = (value: string) => {
      itemTLine.time.thing = value;
      setInputThing(value);
      onTimeLineChange(itemTLine);
  };

  const changeInputType = (_index: number) => {
    //console.log('changeType');
    let tempType: boolean[] = new Array(5).fill(false);
    switch(_index) {
        case 0: tempType[0] = true; break;
        case 1: tempType[1] = true; break;
        case 2: tempType[2] = true; break;
        case 3: tempType[3] = true; break;
        case 4: tempType[4] = true; break;
    }
    setType(tempType);
    onStatusChange(itemTLine.index);
  };

  useEffect(() => {
    if (!status) {
        const tempType: boolean[] = new Array(5).fill(false);
        setType(tempType);
    }
  }, [status]);//-- change all time?

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 20,
        },
    }}>
      <div ref={ref} style={{ opacity, display: 'flex', alignItems: 'center' }} data-handler-id={handlerId}>
        {type[0] ? <InputNumber min={0} max={23} value={inputStartHour}
          onChange={e => (handleTimeChange(e, 0))} changeOnWheel />
          : <button onClick={() => changeInputType(0)}>{inputStartHour}</button>}
        <span>:</span>
        {type[1] ? <InputNumber min={0} max={59} value={inputStartMinute}
          onChange={e => (handleTimeChange(e, 1))} changeOnWheel />
          : <button onClick={() => changeInputType(1)}>{inputStartMinute}</button>}
        <span>~</span>
        {type[2] ? <InputNumber min={0} max={23} value={inputEndHour}
          onChange={e => (handleTimeChange(e, 2))} changeOnWheel />
          : <button onClick={() => changeInputType(2)}>{inputEndHour}</button>}
        <span>:</span>
        {type[3] ? <InputNumber min={0} max={59} value={inputEndMinute}
          onChange={e => (handleTimeChange(e, 3))} changeOnWheel />
          : <button onClick={() => changeInputType(3)}>{inputEndMinute}</button>}
        <span>-</span>
        {type[4] ? <Input placeholder='Basic usage' value={inputThing}
          onChange={e => (handleThingChange(e.target.value))} />
          : <button onClick={() => changeInputType(4)}>{inputThing}</button>}
      </div>
    </ConfigProvider>
  );
}