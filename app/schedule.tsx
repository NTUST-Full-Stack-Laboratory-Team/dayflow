"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import PieChart from './component/PieChart';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from 'immutability-helper'
import { TimeLine } from "./component/TimeLine";
import { Timeline, Button, ConfigProvider } from "antd";
import { color } from "chart.js/helpers";
import { PieChartOutlined } from '@ant-design/icons'
import { ItemTLine, Label } from "./component/Constants";
import PieChartDialog from "./component/PieChart";


export default function Schedule() {
    const [schedule, setSchedule] = useState<ItemTLine[]>(() => {
        const storedData = localStorage.getItem("mySchedule");

        return storedData ? JSON.parse(storedData) : [];
    });
    const [status, setStatus] = useState<boolean[]>(new Array(schedule.length).fill(false));
    const [labels, setLabels] = useState<Label[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const ifSave: boolean = useMemo(() => {
        status.map((value) => {
            if (value) {
                //setIsDialogOpen(false); //-- close when edit
                return false;
            }
        })
        return true;
    }, [status]);
    const chartData = useMemo(() => {
        if (ifSave) return labels.map(label => label.minute);
        return [];
    }, [labels, ifSave]);
    const chartLabel = useMemo(() => {
        if (ifSave) return labels.map(label => label.value);
        return [];
    }, [labels, ifSave]);

    const openDialog = (): void => {
        setIsDialogOpen(true);
    }

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

    const handleStatusChange = (index: number) => {
        let newStatus: boolean[] = new Array(status.length).fill(false);
        if (index !== -1) {
            newStatus[index] = true;
        }
        setStatus(newStatus);
    }

    const addLabels = () => {
        let newLabels: Label[] = [];
        schedule.map((value) => {
            let ifExist = false;
            let wasteTime = (value.time.endHour - value.time.startHour) * 60 + (value.time.endMinute - value.time.startMinute);
            newLabels.some((label) => {
                if (value.time.thing == label.value) {
                    ifExist = true;
                    label.minute += wasteTime;
                    return true;
                }
            })

            if (!ifExist) {
                let newLabel: Label = {
                    value: value.time.thing,
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

            return ({
                children: (
                    <TimeLine
                        key={`timeLine_${value.id}`}
                        itemTLine={tempTLine}
                        onTimeLineChange={handleTimeLine}
                        status={status[index]}//--use id
                        onStatusChange={handleStatusChange}
                        moveLine={moveLine}
                        option={labels}
                    />
                )
            })
        }))
    }, [schedule, status]);

    return (
        <>
        <div className="h-[95%] flex flex-col items-start text-nowrap overflow-auto">
            <ConfigProvider theme={{
                token: {
                    colorPrimary: '#748cab',
                    controlHeight: 20,
                    fontSize: 18
                },
            }}>
                <div className="flex flex-col items-start h-[95%] ">
                    <DndProvider backend={HTML5Backend}>
                        <Timeline className="font-mono" items={items} />
                        <Button className="font-mono flex items-center invisible group-hover:visible" type="text" onClick={handleClick}>Add new timeLine</Button>
                        <br></br>
                    </DndProvider >
                </div>
                
            </ConfigProvider >
            
            <PieChartDialog data={chartData} labels={chartLabel} isOpen={isDialogOpen}
                onClose={() => { setIsDialogOpen(false) }} />
        </div>
        <div className="h-[5%] w-full flex flex-row justify-end pr-4 invisible group-hover:visible">
                    <button className="flex items-center" onClick={openDialog}>{<PieChartOutlined style={{ fontSize: '120%' }} />}</button>
            </div>
        </>
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
