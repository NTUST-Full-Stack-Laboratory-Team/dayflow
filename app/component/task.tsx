import { useState, useRef, FC } from 'react';
import type { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd';
import TodoDialog from './todoDialog';
import { ItemTask, ItemTypes } from '../task';
import "./task.css"
import classNames from 'classnames';
import { Input } from "antd";
import { CloseCircleOutlined, CheckCircleFilled } from '@ant-design/icons';

interface TaskProps extends ItemTask {
    onComplete: (index: number) => void;
    onEdit: (index: number) => void;
    onFinish: (index: number) => void;
    onTitleChange: (title: string) => void; // Callback function type
    moveTask: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
    index: number
    id: string
    type: string
}

export const Task: FC<TaskProps> = (props: TaskProps) => {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
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
            return { id: props.id, index: props.index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))

    const handelInfoClick = (): void => {
        setIsInfoOpen(true);
    }

    return (
        <div className="flex flex-row" ref={ref} style={{ opacity }} data-handler-id={handlerId}>
            <TodoDialog isOpen={isInfoOpen} onClose={() => { setIsInfoOpen(false) }} />
            <button onClick={() => props.onComplete(props.index)}>
                {props.isComplete ? <CheckCircleFilled /> : <CloseCircleOutlined />}
            </button>
            {
                <form action="javascript:;" onSubmit={() => props.onFinish(props.index)}>
                    <Input type="string" className={classNames('task', { 'task-editing': props.isEdit })} onChange={(e) => props.onTitleChange(e.target.value)} onClick={() => props.onEdit(props.index)} style={{
                        textDecoration: props.isComplete ?
                            'line-through' : 'none'
                    }} value={props.title} readOnly={!props.isEdit} />
                    <button type="submit" style={{ display: props.isEdit ? "" : "none" }}>submit</button>
                </form>
            }
            <button onClick={handelInfoClick} style={{ display: props.isEdit ? "" : "none" }}>
                " i "
            </button>
        </div >
    )
}