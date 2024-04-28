import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import TodoDialog from './todoDialog';

interface FnTask {
    isEdit: boolean,
    isComplete: boolean,
    title: string,
    subTask?: FnTask[];
}

interface TaskProps extends FnTask {
    onComplete: () => void;
    onEdit: () => void;
    onTitleChange: (title: string) => void; // Callback function type
}

const Task = (props: FnTask & TaskProps & { id: string, onDrop: (id: string) => void }) => {
    const [listTitle, setListTitle] = useState<string>("");

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setListTitle(e.target.value);
        props.onTitleChange(listTitle);
    }

    const [{ isDragging }, drag] = useDrag({
        type: 'item',
        item: { id: props.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'item',
        drop: (droppedItem: { id: string }) => props.onDrop(droppedItem.id),
    });

    const opacity = isDragging ? 0.4 : 1;

    return (
        <div ref={(node) => drag(drop(node))} style={{ opacity, cursor: 'move' }}>
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