"use client"
import { useState } from 'react';

interface FnTask {
    isComplete: boolean;
    title: string;
}

export default function Todo() {
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [tasks, setTasks] = useState<FnTask[]>([]);

    const addTask = (): void => {
        if (taskTitle.trim() !== "") {
            const newTask: FnTask = {
                isComplete: false,
                title: taskTitle
            };
            setTasks([...tasks, newTask]);
            setTaskTitle(""); // 清空输入字段
        }
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTaskTitle(e.target.value);
    }

    const handleClick = (index: number): void => {
        const newTasks = [...tasks];
        newTasks[index].isComplete = !(tasks[index].isComplete);
        setTasks(newTasks);
    }

    return (
        <>
            <div>
                <div>{tasks.map((task, index) =>
                    <div key={index}>
                        <button onClick={() => handleClick(index)}>
                            {task.isComplete ? "✔" : "❌"}
                        </button>
                        {task.title}
                    </div>)}
                </div>
                <div>
                    <input type="string" value={taskTitle} onChange={handleTitleChange} />
                    <button onClick={addTask} value={taskTitle}>Add</button>
                </div>
            </div>
        </>
    )
}