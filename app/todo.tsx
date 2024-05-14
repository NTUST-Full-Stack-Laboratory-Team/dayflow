"use client"
import { useState, useCallback, useEffect } from 'react';
import update from 'immutability-helper'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoDialog from './component/todoDialog';
import { Task } from './component/task'
import { ItemTask } from './task';
import { Input, Space, Button } from "antd";
import { PlusCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

export default function Todo({ name, countCompleteness}: {name: string, countCompleteness: (percent: number, name: string) => void}) {
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [tasks, setTasks] = useState<ItemTask[]>([]);
    const [editingTaskIndex, setEditingTaskIndex] =
        useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [completeNum, setCompleteNum] = useState<number>(() => {
        let count = 0;
        tasks.map((value) => {
            if (value.isComplete) count++;
        })
        return count;
    })

    useEffect(() => {
        const completeness = Math.round((completeNum * 100) / tasks.length);
        countCompleteness(completeness, name);
    }, [completeNum, tasks.length])

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

        if (newTasks[index].isComplete) setCompleteNum(pre => (pre + 1));
        else setCompleteNum(pre => (pre - 1));
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
            <TodoDialog isOpen={isDialogOpen}
                onClose={() => { setIsDialogOpen(false) }} />
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
                        <div className="flex flex-row invisible group-hover:visible">
                            <button className="flex items-center" onClick={openDialog}>{<InfoCircleOutlined style={{ fontSize: '120%' }} />}</button>
                            &nbsp;
                            <form className="flex flex-row" action="javascript:;" onSubmit={() => addTask(tasks.length, tasks.length)}>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input className="text-sm font-mono border-gray-100 background-color: transparent;"
                                        type="string"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)} />
                                    <Button className="border-gray-100  flex items-center" type="text" value={taskTitle} onClick={() => addTask(tasks.length, tasks.length)}>
                                        {<PlusCircleOutlined style={{ fontSize: '120%' }} />}
                                    </Button>
                                </Space.Compact>
                            </form>
                        </div>
                    )
                }
                {/* <pre>{JSON.stringify(tasks, null, 2)}</pre> */}
            </div >
        </DndProvider >
    )
}