import { useState, useRef } from 'react';
import type { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd';
import TodoDialog from './todoDialog';
import { ITask, ItemTypes } from '../task';

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
}

interface TaskProps extends ITask {
    onComplete: () => void;
    onEdit: () => void;
    onTitleChange: (title: string) => void; // Callback function type
    moveTask: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
    index: number
    id: string
    type: string
}

const Task = (props: TaskProps) => {
    const [listTitle, setListTitle] = useState<string>("");
    const ref = useRef<HTMLDivElement>(null)

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.TASK,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = props.index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

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
            props.moveTask(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TASK,
        item: () => {
            return (props.id, props.index)
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0 : 1


    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setListTitle(e.target.value);
        props.onTitleChange(listTitle);
    }

    return (
        <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
            <div>
                <button onClick={props.onComplete}>
                    {props.isComplete ? "✔" : "❌"}
                </button>
                {
                    props.isEdit ? (
                        <div>
                            <input type="string" value={listTitle}
                                onChange={(e) => handleTitleChange(e)} />
                            <button>" i "</button>
                            <button>Finish</button>
                        </div>
                    ) : (
                        <span onClick={props.onEdit} style={{
                            textDecoration: props.isComplete ?
                                'line-through' : 'none'
                        }}>
                            {props.title}
                        </span>
                    )
                }
            </div>
        </div >
    )
}

export default Task;