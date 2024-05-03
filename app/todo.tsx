"use client"
import { useState } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoDialog from './component/todoDialog';
import Task from './component/task'
import { ITask } from './task';

// interface TaskInf {
//     label: string;
// }

// const ItemTypes = {
//     TASK: "task"
// };

export default function Todo() {
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [editingTaskIndex, setEditingTaskIndex] =
        useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);



    const openDialog = (): void => {
        setIsDialogOpen(true);
    }

    const addTask = (idNum: string, index: number): void => {
        if (taskTitle.trim() !== "") {
            const newTask: ITask = {
                id: idNum,
                isEdit: false,
                index: index,
                isComplete: false,
                title: taskTitle,
            };
            setTasks([...tasks, newTask]);
            setTaskTitle(""); // 清空输入字段
        }
    }

    // const addSubTask = (indexFrom: number, indexTar: number, indexSub: number): void => {
    //     const newTasks: FnTask[] = {
    //         ...tasks
    //     }
    //     if (newTasks[indexTar].subTask === undefined) {
    //         newTasks[indexTar].subTask = []; // Initialize subTask array if it's undefined
    //         indexSub = 0;
    //     }
    //     newTasks[indexTar].subTask[indexSub] = newTasks[indexFrom];
    //     setTasks(newTasks);
    // }

    const handleComplete = (index: number): void => {
        const newTasks = [...tasks];
        newTasks[index].isComplete = !(tasks[index].isComplete);
        setTasks(newTasks);
    }

    const handleTitleClick = (index: number): void => {
        const newTasks = [...tasks];
        newTasks[index].isEdit = true;
        setEditingTaskIndex(index);
    }

    const handleTitleChange = (title: string, index: number) => {
        setTaskTitle(title);
        const newTasks = [...tasks];
        newTasks[index].title = title;
        setTasks(newTasks);
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <div>{tasks.map((task, index) =>
                    <div key={index}>
                        {/* <Task id={task.id}
                            isEdit={task.isEdit}
                            isComplete={task.isComplete}
                            title={task.title}
                            onComplete={() => handleComplete(index)}
                            onEdit={() => handleTitleClick(index)}
                            onTitleChange={(title: string) =>
                                handleTitleChange(title, index)}
                            onDrop={(idDrag: string, idDrop: string) =>
                                handleDrop(idDrag, idDrop)} /> */}
                    </div>)}
                </div>
                {
                    editingTaskIndex !== null ? (
                        <></>
                    ) : (
                        <div>
                            <>❌</>
                            <input type="string"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)} />
                            <button onClick={openDialog}>" i "</button>
                            <button onClick={() => addTask("item" + (tasks.length), tasks.length)}
                                value={taskTitle}>Add</button>
                        </div>
                    )
                }
                <TodoDialog isOpen={isDialogOpen}
                    onClose={() => { setIsDialogOpen(false) }} />
            </div >
        </DndProvider >
    )
}
{/* <div>
<button onClick={() => handleClick(index)}>
    {task.isComplete ? "✔" : "❌"}
</button>
{
    editingTaskIndex !== index ? (
        <span style={{ textDecoration: task.isComplete ? 'line-through' : 'none' }}
            onClick={() => handleTitleClick(index)}>
            {task.title}
        </span>
    ) : (
        <div>
            <input type="string" value={listTitle}
                onChange={(e) => handleTitleChange(e, index)}
                onBlur={handleTitleBlur} />
            <button onClick={openDialog}>" i "</button>
        </div>
    )
}
</div> */}

{/* <div>{task.subTask && task.subTask.map((subTask, subIndex) =>
<div key={subIndex}>
    <button onClick={() => handleClick(subIndex)}>
        {subTask.isComplete ? "✔" : "❌"}
    </button>
    {
        editingTaskIndex !== subIndex ? (
            <span style={{ textDecoration: subTask.isComplete ? 'line-through' : 'none' }}
                onClick={() => handleTitleClick(subIndex)}>
                {subTask.title}
            </span>
        ) : (
            <div>
                <input type="string" value={listTitle}
                    onChange={(e) => handleTitleChange(e, subIndex)}
                    onBlur={handleTitleBlur} />
                <button onClick={openDialog}>" i "</button>
            </div>
        )
    }
</div>)}
</div> */}