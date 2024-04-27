"use client";
import React, { useState, useEffect } from "react";

type Time = {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    thing: string;
}

type Label = {
    thing: string;
    minute: number;
}

export default function Schedule() {
    const [schedule, setSchedule] = useState<Time[]>(() => {
        const storedData = localStorage.getItem("mySchedule");

        return storedData ? JSON.parse(storedData) : [];
    });
    const [status, setStatus] = useState<boolean[]>(new Array(schedule.length).fill(false));
    const [labels, setLabels] = useState<Label[]>([]);

    useEffect(() => {
        console.log('Schedule render');
        localStorage.setItem("mySchedule", JSON.stringify(schedule));
        addLabels();
    }, [schedule]);

    useEffect(() => {
        console.log('render');
    });

    const handleClick = () => {
        let newTime: Time = {
            startHour: 0,
            startMinute: 0,
            endHour: 0,
            endMinute: 0,
            thing: "something",
        }
        
        setSchedule([...schedule.slice(), newTime]);
        setStatus([...status.slice(), false]);
    };

    const handleTimeLine = (index: number, value: Time) => {
        let newSchedule: Array<Time> = schedule.slice();
        newSchedule[index] = value;
        setSchedule(newSchedule);
    };

    const handleSave = () => {
        setSchedule(schedule);
        // schedule.map((value, _) => {
        //     console.log(value.hour + ":" + value.minute + "-" + value.thing);
        // })
        setStatus(new Array(status.length).fill(false));
    };

    const handleStatusChange = (index: number) => {
        let newStatus: boolean[] = new Array(status.length).fill(false);
        newStatus[index] = true;
        setStatus(newStatus);
    }
    
    const addLabels = () => {
        let newLables: Label[] = [];
        schedule.map((value) => {
            let ifExist = false;
            let wasteTime = (value.endHour - value.startHour) * 60 + (value.endMinute - value.startMinute);
            newLables.some((label) => {
                if (value.thing == label.thing) {
                    ifExist = true;
                    label.minute += wasteTime;
                    return true;
                }
            })

            if (!ifExist) {
                let newLabel: Label = {
                    thing: value.thing,
                    minute: wasteTime
                }
                newLables = [...newLables, newLabel];
            }
        })
        setLabels(newLables);
    };

    return (
        <>
            {schedule.map((value, index) => (
                <TimeLine index={index} myTimeLine={value} onTimeLineChange={handleTimeLine} status={status[index]} onStatusChange={handleStatusChange} key={`timeLine_${index}`}/>
            ))}
            <button onClick={handleClick}>add new timeLine</button>
            <button onClick={handleSave}>save</button>
            <br></br>
            <div>labels</div>
            <ul>
                {labels.map((value, index) => (
                    <li key={`labels_${index}`}>{value.thing} 
                        - {Math.floor(value.minute / 60)}:{value.minute % 60}</li>
                ))}
            </ul>
        </>
    );
}

const TimeLine: React.FC<{ index: number; myTimeLine: Time; onTimeLineChange: (index: number, value: Time) => void; status: boolean; onStatusChange: (index: number) => void }> 
    = ({ index, myTimeLine, onTimeLineChange, status, onStatusChange }) => {
    const [inputStartHour, setInputStartHour] = useState<number>(myTimeLine.startHour);
    const [inputEndHour, setInputEndHour] = useState<number>(myTimeLine.endHour);
    const [inputStartMinute, setInputStartMinute] = useState<number>(myTimeLine.startMinute);
    const [inputEndMinute, setInputEndMinute] = useState<number>(myTimeLine.endMinute);
    const [inputThing, setInputThing] = useState<string>(myTimeLine.thing);
    const [type, setType] = useState<boolean[]>(new Array(5).fill(false));

    useEffect(() => {
        console.log('TimeLine render');
    }, [myTimeLine]);

    const handleStartHourChange = (value: number) => {
        if (value < 0) myTimeLine.startHour = 0;
        else if (value >= 24) myTimeLine.startHour = 23;
        else myTimeLine.startHour = value;
        setInputStartHour(myTimeLine.startHour);
        onTimeLineChange(index, myTimeLine);
    };

    const handleEndHourChange = (value: number) => {
        if (value < 0) myTimeLine.endHour = 0;
        else if (value >= 24) myTimeLine.endHour = 23;
        else myTimeLine.endHour = value;
        setInputEndHour(myTimeLine.endHour);
        onTimeLineChange(index, myTimeLine);
    };

    const handleStartMinuteChange = (value: number) => {
        if (value < 0) myTimeLine.startMinute = 0;
        else if (value >= 60) myTimeLine.startMinute = 59;
        else myTimeLine.startMinute = value;
        setInputStartMinute(myTimeLine.startMinute);
        onTimeLineChange(index, myTimeLine);
    };

    const handleEndMinuteChange = (value: number) => {
        if (value < 0) myTimeLine.endMinute = 0;
        else if (value >= 60) myTimeLine.endMinute = 59;
        else myTimeLine.endMinute = value;
        setInputEndMinute(myTimeLine.endMinute);
        onTimeLineChange(index, myTimeLine);
    };

    const handleThingChange = (value: string) => {
        myTimeLine.thing = value;
        setInputThing(myTimeLine.thing);
        onTimeLineChange(index, myTimeLine);
    };

    const changeInputType = (_index: number) => {
        //console.log('changeType');
        let tempType: boolean[] = new Array(5).fill(false);
        switch(_index) {
            case 0: tempType[0] = true; break;
            case 1: tempType[1] = true; break;
            case 2: tempType[2] = true; break;
            case 3: tempType[3] = true; break;
            case 4: tempType[4] = true; break;
        }
        setType(tempType);
        onStatusChange(index);
    };

    useEffect(() => {
        if (!status) {
            const tempType: boolean[] = new Array(5).fill(false);
            setType(tempType);
        }
    }, [status]);

    return (
        <>
            <div style={{ display: 'inline-block' }}>
            {type[0] ? <input type="number" value={inputStartHour}
                onChange={e => (handleStartHourChange(parseInt(e.target.value)))} />
                : <button onClick={() => changeInputType(0)}>{inputStartHour}</button>}
            <span>:</span>
            {type[1] ? <input type="number" value={inputStartMinute}
                onChange={e => (handleStartMinuteChange(parseInt(e.target.value)))} />
                : <button onClick={() => changeInputType(1)}>{inputStartMinute}</button>}
            <span>~</span>
            {type[2] ? <input type="number" value={inputEndHour}
                onChange={e => (handleEndHourChange(parseInt(e.target.value)))} />
                : <button onClick={() => changeInputType(2)}>{inputEndHour}</button>}
            <span>:</span>
            {type[3] ? <input type="number" value={inputEndMinute}
                onChange={e => (handleEndMinuteChange(parseInt(e.target.value)))} />
                : <button onClick={() => changeInputType(3)}>{inputEndMinute}</button>}
            <span>-</span>
            {type[4] ? <input type="text" value={inputThing}
                onChange={e => (handleThingChange(e.target.value))} />
                : <button onClick={() => changeInputType(4)}>{inputThing}</button>}
            

            </div>

        </>
    );
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
