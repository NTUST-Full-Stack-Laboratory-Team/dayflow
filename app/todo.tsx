"use client"
import { useState } from 'react';

interface FnTask {
    isComplete: boolean;
    title: string;
    subTask?: FnTask[];
}

export default function Todo() {
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [listTitle, setListTitle] = useState<string>("");
    const [tasks, setTasks] = useState<FnTask[]>([]);
    const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);

    const addTask = (): void => {
        if (taskTitle.trim() !== "") {
            const newTask: FnTask = {
                isComplete: false,
                title: taskTitle,
            };
            setTasks([...tasks, newTask]);
            setTaskTitle(""); // 清空输入字段
        }
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
        setListTitle(e.target.value);
        tasks[index].title = e.target.value;
    }

    const handleClick = (index: number): void => {
        const newTasks = [...tasks];
        newTasks[index].isComplete = !(tasks[index].isComplete);
        setTasks(newTasks);
    }

    const handleTitleClick = (index: number): void => {
        setListTitle(tasks[index].title);
        setEditingTaskIndex(index);
    }

    const handleTitleBlur = (): void => {
        setEditingTaskIndex(null);
    }

    return (
        <>
            <div>
                <div>{tasks.map((task, index) =>
                    <div key={index}>
                        <button onClick={() => handleClick(index)}>
                            {task.isComplete ? "✔" : "❌"}
                        </button>
                        {
                            editingTaskIndex === index ? (
                                <div>
                                    <input type="string" value={listTitle}
                                        onChange={(e) => handleTitleChange(e, index)}
                                        onBlur={handleTitleBlur}
                                        autoFocus />
                                    <button>" i "</button>
                                </div>
                            ) : (
                                <span style={{ textDecoration: task.isComplete ? 'line-through' : 'none' }}
                                    onClick={() => handleTitleClick(index)}>
                                    {task.title}
                                </span>
                            )
                        }
                        <div>{task.subTask && task.subTask.map((subTask, subIndex) =>
                            <div key={subIndex}>
                                <button onClick={() => handleClick(subIndex)}>
                                    {subTask.isComplete ? "✔" : "❌"}
                                </button>
                                {
                                    editingTaskIndex === subIndex ? (
                                        <div>
                                            <input type="string" value={listTitle}
                                                onChange={(e) => handleTitleChange(e, subIndex)}
                                                onBlur={handleTitleBlur}
                                                autoFocus />
                                            <button>" i "</button>
                                        </div>
                                    ) : (
                                        <span style={{ textDecoration: subTask.isComplete ? 'line-through' : 'none' }}
                                            onClick={() => handleTitleClick(subIndex)}>
                                            {subTask.title}
                                        </span>
                                    )
                                }
                            </div>)}
                        </div>
                    </div>)}
                </div>
                {
                    editingTaskIndex !== null ? (
                        <></>
                    ) : (
                        <div>
                            <>❌</>
                            <input type="string" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                            <button>" i "</button>
                            <button onClick={addTask} value={taskTitle}>Add</button>
                        </div>
                    )
                }
            </div >
        </>
    )
}