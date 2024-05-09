import { useState, useRef, FC, useEffect } from 'react';
import type { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd'

import { ItemTypes, ItemTLine } from './Constants'

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

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

    const handleStartHourChange = (value: number) => {
        if (value < 0) value = 0;
        else if (value >= 24) value = 23;
        itemTLine.time.startHour = value;
        setInputStartHour(value);
        onTimeLineChange(itemTLine);
    };

    const handleEndHourChange = (value: number) => {
        if (value < 0) value = 0;
        else if (value >= 24) value = 23;
        itemTLine.time.endHour = value;
        setInputEndHour(value);
        onTimeLineChange(itemTLine);
    };

    const handleStartMinuteChange = (value: number) => {
        if (value < 0) value = 0;
        else if (value >= 60) value = 59;
        itemTLine.time.startMinute = value;
        setInputStartMinute(value);
        onTimeLineChange(itemTLine);
    };

    const handleEndMinuteChange = (value: number) => {
        if (value < 0) value = 0;
        else if (value >= 60) value = 59;
        itemTLine.time.endMinute = value;
        setInputEndMinute(value);
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
        onStatusChange(itemTLine.id);
    };

    useEffect(() => {
        if (!status) {
            const tempType: boolean[] = new Array(5).fill(false);
            setType(tempType);
        }
    }, [status]);//-- change all time?

    return (
        <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
            {type[0] ? <input type="number" value={inputStartHour}
                onChange={e => (handleStartHourChange(parseInt(e.target.value)))} />
                : <button onClick={() => changeInputType(0)}>{inputStartHour}</button>}
            <span>:</span>
            {type[1] ? <input type="number" value={inputStartMinute}
                onChange={e => (handleStartMinuteChange(parseInt(e.target.value)))} />
                : <button onClick={() => changeInputType(1)}>{inputStartMinute}</button>}
            <span>~</span>
            {type[2] ? <input type="number" value={inputEndHour}
                onChange={e => (handleEndHourChange(parseInt(e.target.value)))} />
                : <button onClick={() => changeInputType(2)}>{inputEndHour}</button>}
            <span>:</span>
            {type[3] ? <input type="number" value={inputEndMinute}
                onChange={e => (handleEndMinuteChange(parseInt(e.target.value)))} />
                : <button onClick={() => changeInputType(3)}>{inputEndMinute}</button>}
            <span>-</span>
            {type[4] ? <input type="text" value={inputThing}
                onChange={e => (handleThingChange(e.target.value))} />
                : <button onClick={() => changeInputType(4)}>{inputThing}</button>}
        </div>
    );
}