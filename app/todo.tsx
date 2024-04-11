import { useState } from 'react';

interface FnTask {
    isComplete: Boolean;
    title: String;
}

export default function Todo() {
    const [tasks, setTasks] = useState<FnTask[]>([]);

    function addTask(taskTitle: string) {
        const newTask: FnTask = {
            isComplete: false,
            title: taskTitle
        };
        setTasks([...tasks, newTask]);
    }

    return (
        <div>{tasks.map((task) => <>{task}</>)}</div>
    )
}