"use client"
import { useState, useCallback } from 'react';
import update from 'immutability-helper'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoDialog from './component/todoDialog';
import { Task } from './component/task'
import { ItemTask } from './task';

export default function Todo() {
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [tasks, setTasks] = useState<ItemTask[]>([]);
    const [editingTaskIndex, setEditingTaskIndex] =
        useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);



    const openDialog = (): void => {
        setIsDialogOpen(true);
    }

    const addTask = (idNum: number, index: number): void => {
        if (taskTitle.trim() !== "") {
            const newTask: ItemTask = {
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
        setTasks(newTasks);
        setEditingTaskIndex(index);
    }

    const handleTitleChange = (title: string, index: number) => {
        const newTasks = [...tasks];
        newTasks[index].title = title;
        setTasks(newTasks);
    }

    const handleEditFinish = (index: number) => {
        const newTasks = [...tasks];
        tasks[index].isEdit = false;
        setTasks(newTasks);
        setEditingTaskIndex(null);
    }

    const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
        setTasks((prevCards: ItemTask[]) =>
            update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex] as ItemTask],
                ],
            }),
        )
    }, [setTasks])

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <div>
                    {tasks.map((task, index) => (
                        <Task key={task.id}
                            id={task.id}
                            isEdit={task.isEdit}
                            index={index}
                            isComplete={task.isComplete}
                            title={task.title}
                            onComplete={() => handleComplete(index)}
                            onEdit={() => handleTitleClick(index)}
                            onFinish={() => handleEditFinish(index)}
                            onTitleChange={(title: string) =>
                                handleTitleChange(title, index)}
                            moveTask={moveTask} />))}
                </div>
                {
                    editingTaskIndex !== null ? (
                        <></>
                    ) : (
                        <div className="flex flex-row">
                            <form action="javascript:;" onSubmit={() => addTask(tasks.length, tasks.length)}>
                                <>❌</>
                                <input type="string"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)} />
                                <button value={taskTitle}>Add</button>
                            </form>
                            <button onClick={openDialog}>" i "</button>
                        </div>
                    )
                }
                <TodoDialog isOpen={isDialogOpen}
                    onClose={() => { setIsDialogOpen(false) }} />
                {/* <pre>{JSON.stringify(tasks, null, 2)}</pre> */}
            </div >
        </DndProvider >
    )
}