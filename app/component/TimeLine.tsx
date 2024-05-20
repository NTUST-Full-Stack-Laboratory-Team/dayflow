import { useState, useRef, FC, useEffect } from 'react';
import type { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes, ItemTLine, Label } from './Constants'
import { ConfigProvider, InputNumber, Input, DatePicker, Space } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

export interface TLineProps {
  itemTLine: ItemTLine;
  onTimeLineChange: (value: ItemTLine) => void;
  status: boolean;
  onStatusChange: (index: number) => void;
  moveLine: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number
  id: string
  type: string
}

export const TimeLine: React.FC<TLineProps> = ({ itemTLine, onTimeLineChange, status, onStatusChange, moveLine }) => {
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

  const handleInputChange = (value: string, type: string) => {
    switch (type) {
      case "start": itemTLine.time.start = value; break;
      case "end": itemTLine.time.end = value; break;
      case "thing": itemTLine.time.thing = value; break;
    }
    onTimeLineChange(itemTLine);
  }
  // const handleTimeChange = (value: number | null, _index: number) => {
  //   if (value == null) return;
  //   switch (_index) {
  //     case 0: itemTLine.time.startHour = value; break;
  //     case 1: itemTLine.time.startMinute = value; break;
  //     case 2: itemTLine.time.endHour = value; break;
  //     case 3: itemTLine.time.endMinute = value; break;
  //   }
  //   onTimeLineChange(itemTLine);
  // };

  // const handleThingChange = () => {
  //   itemTLine.time.thing = thing;
  //   onTimeLineChange(itemTLine);
  // };

  const handleEdit = () => {
    onStatusChange(itemTLine.index);
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    //if not in the container of ref
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      onStatusChange(-1);
    }
  };

  const onOk = (value: RangePickerProps['value']) => {
    console.log('onOk: ', value);
  };

  return (
    <div ref={ref} style={{ opacity, display: 'flex', alignItems: 'center' }}
      data-handler-id={handlerId} onClick={handleEdit}>
      {status ?
        <>
          <RangePicker picker='time' showTime={{ format: 'HH:mm' }} format="HH:mm" 
            defaultValue={[dayjs(itemTLine.time.start, 'HH:mm'), dayjs(itemTLine.time.end, 'HH:mm')]}
            onChange={(_, dateString) => {
              console.log('Formatted Selected Time: ', dateString[0]);
              handleInputChange(dateString[0], "start")
              handleInputChange(dateString[1], "end")
            }}
            onOk={onOk} allowClear={false}
          />
          <span>-</span>
          <Input value={thing} autoFocus
            onBlur={() => handleInputChange(thing, "thing")} onChange={e => setThing(e.target.value)} />
        </>
        : (
          <>
            <span>{itemTLine.time.start} ~ {itemTLine.time.end} - {itemTLine.time.thing}</span>
          </>
        )}
      
    </div>
  );
}

/*<InputNumber min={0} max={23} value={itemTLine.time.startHour}
            onChange={e => (handleInputChange(e, 0))} changeOnWheel />
          <span>:</span>
          <InputNumber min={0} max={59} value={itemTLine.time.startMinute}
            onChange={e => (handleTimeChange(e, 1))} changeOnWheel />
          <span>~</span>
          <InputNumber min={0} max={23} value={itemTLine.time.endHour}
            onChange={e => (handleTimeChange(e, 2))} changeOnWheel />
          <span>:</span>
          <InputNumber min={0} max={59} value={itemTLine.time.endMinute}
            onChange={e => (handleTimeChange(e, 3))} changeOnWheel />*/