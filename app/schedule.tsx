"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import PieChart from './component/PieChart';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from 'immutability-helper'
import { ItemTLine, Label } from "./component/Constants";
import { TimeLine } from "./component/TimeLine";
import { Timeline } from "antd";


export default function Schedule() {
    const [schedule, setSchedule] = useState<ItemTLine[]>(() => {
        const storedData = localStorage.getItem("mySchedule");

        return storedData ? JSON.parse(storedData) : [];
    });
    const [status, setStatus] = useState<boolean[]>(new Array(schedule.length).fill(false));
    const [labels, setLabels] = useState<Label[]>([]);
    const ifSave: boolean = useMemo(() => {
        status.map((value) => {
            if (value) return false;
        })
        return true;
    }, [status]);
    const chartData = useMemo(() => {
        if (ifSave) return labels.map(label => label.minute);
        return null;
    }, [labels, ifSave]);
    const chartLabel = useMemo(() => {
        if (ifSave) return labels.map(label => label.thing);
        return null;
    }, [labels, ifSave]);
    
    useEffect(() => {
        //console.log('Schedule render');
        localStorage.setItem("mySchedule", JSON.stringify(schedule));

        //dill the label and chart
        addLabels();
    }, [schedule]);

    const handleClick = () => {
        let newTime: ItemTLine = {
            id: schedule.length,
            index: schedule.length,
            time: {
                startHour: 0,
                startMinute: 0,
                endHour: 0,
                endMinute: 0,
                thing: "something",
            }
        }
        if (schedule.length != 0) {
            const tempLine = schedule[schedule.length - 1].time;
            newTime.time = {
                startHour: tempLine.endHour,
                startMinute: tempLine.endMinute,
                endHour: tempLine.endHour + 1,
                endMinute: 0,
                thing: "something",
            }
        }
        
        setSchedule([...schedule.slice(), newTime]);
        setStatus(new Array(status.length + 1).fill(false));
    };

    const handleTimeLine = (value: ItemTLine) => {
        let newSchedule: Array<ItemTLine> = schedule.slice();
        newSchedule[value.index] = value;
        setSchedule(newSchedule);
    };

    const handleSave = () => {
        setSchedule(schedule);
        setStatus(new Array(status.length).fill(false));
        console.log("ok");
    };

    const handleStatusChange = (index: number) => {
        let newStatus: boolean[] = new Array(status.length).fill(false);
        newStatus[index] = true;
        setStatus(newStatus);
    }
    
    const addLabels = () => {
        let newLabels: Label[] = [];
        schedule.map((value) => {
            let ifExist = false;
            let wasteTime = (value.time.endHour - value.time.startHour) * 60 + (value.time.endMinute - value.time.startMinute);
            newLabels.some((label) => {
                if (value.time.thing == label.thing) {
                    ifExist = true;
                    label.minute += wasteTime;
                    return true;
                }
            })

            if (!ifExist) {
                let newLabel: Label = {
                    thing: value.time.thing,
                    minute: wasteTime
                }
                newLabels = [...newLabels, newLabel];
            }
        })
        setLabels(newLabels);
    };

    const moveLine = useCallback((dragIndex: number, hoverIndex: number) => {
        setSchedule((prevCards: ItemTLine[]) =>
            update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex] as ItemTLine],
                ],
            }),
        );
        setStatus(new Array(status.length).fill(false));
    }, [setSchedule])

    const items = useMemo(() => {
        return (schedule.map((value, index) => {
            let tempTLine: ItemTLine = {
                id: value.id,
                index: index,
                time: value.time
            };

            return({children: (
                <TimeLine 
                    key={`timeLine_${value.id}`}
                    itemTLine={tempTLine}
                    onTimeLineChange={handleTimeLine}
                    status={status[index]}//--use id
                    onStatusChange={handleStatusChange}
                    moveLine={moveLine}
                />
            )})
        }))
    }, [schedule, status]);

    return (
        <DndProvider backend={HTML5Backend}>
            <Timeline items={items} />
            <button onClick={handleClick}>add new timeLine</button>
            <button onClick={handleSave}>Done</button>
            <br></br>
        </DndProvider>
    );
    // <div>labels</div>
    // <ul>
    //     {labels.map((value, index) => (
    //         <li key={`labels_${index}`}>{value.thing} 
    //             - {Math.floor(value.minute / 60)}:{value.minute % 60}</li>
    //     ))}
    // </ul>
    //<PieChart data={chartData} labels={chartLabel} />
}




// function SelectHours({ hour, handleChange }: 
//     { hour: number ; handleChange: (index: number, value: string) => void }) {
//     const numbers = Array.from({ length: 24 }, (_, index) => index);

//     return (
//         <select name="hour" defaultValue={hour} onChange={(e) => handleChange(0, e.target.value)}>
//             <option key={"hour_disable"} value={""} disabled hidden></option>
//             {numbers.map((number) => (
//                 <option key={`hour_${number}`} value={number}>{number}</option>
//             ))}
//         </select>
//     );
// }

// function SelectMinutes({ minute, handleChange }: 
//     { minute: number; handleChange: (index: number, value: string) => void }) {
//     const numbers = Array.from({ length: 12 }, (_, index) => index * 5);

//     return (
//         <select name="minute" defaultValue={minute} onChange={(e) => handleChange(1, e.target.value)}>
//             <option key={"minute_disable"} value={""} disabled hidden></option>
//             {numbers.map((number) => (
//                 <option key={`minute_${number}`} value={number}>{number}</option>
//             ))}
//         </select>
//     );
// }
