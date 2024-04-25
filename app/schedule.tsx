"use client";
import React, { useState, useEffect } from "react";

type Time = {
    hour: number;
    minute: number;
    thing: string;
}

export default function Schedule() {
    const [schedule, setSchedule] = useState<Time[]>(() => {
        const storedData = localStorage.getItem("mySchedule");

        return storedData ? JSON.parse(storedData) : [];
    });
    const [status, setStatus] = useState<boolean[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        console.log('Schedule render');
        localStorage.setItem("mySchedule", JSON.stringify(schedule));
    }, [schedule]);

    useEffect(() => {
        console.log('render');
        
    });

    const handleClick = () => {
        let newTime: Time = {
            hour: 0,
            minute: 0,
            thing: "",
        }
        
        let newSchedule = [...schedule.slice(), newTime];
        setSchedule(newSchedule);
        let newStatus: boolean[] = [...status, false];
        setStatus(newStatus);
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
        let newStatus: Array<boolean> = new Array(status.length).fill(false);
        newStatus[index] = true;
        setStatus(newStatus);
    }
    
    const addLabels = (value: string) => {
        setLabels([...labels.slice(), value]);
    };

    return (
        <>
            {schedule.map((value, index) => (
                <TimeLine index={index} myTimeLine={value} onTimeLineChange={handleTimeLine} status={status[index]} onStatusChange={handleStatusChange} key={`timeLine_${index}`}/>
            ))}
            <button onClick={handleClick}>add new timeLine</button>
            <div>{schedule.length}</div>
            {schedule.map((value, _) => (
                <div>{value.hour}:{value.minute}-{value.thing}</div>
            ))}
            <div>labels</div>
            <ul>
                {labels.map((value, index) => (
                    <li key={`labels_${index}`}>{value}</li>
                ))}
            </ul>
            <button onClick={handleSave}>save</button>
        </>
    );
}

const TimeLine: React.FC<{ index: number; myTimeLine: Time; onTimeLineChange: (index: number, value: Time) => void; status: boolean; onStatusChange: (index: number) => void }> 
    = ({ index, myTimeLine, onTimeLineChange, status, onStatusChange }) => {
    const [inputHour, setInputHour] = useState<number>(myTimeLine.hour);
    const [inputMinute, setInputMinute] = useState<number>(myTimeLine.minute);
    const [inputThing, setInputThing] = useState<string>(myTimeLine.thing);
    const [type, setType] = useState<boolean[]>(new Array(3).fill(false));

    useEffect(() => {
        console.log('TimeLine render');
    }, [myTimeLine]);

    const handleHourChange = (value: string) => {
        myTimeLine.hour = parseInt(value);
        if (myTimeLine.hour < 0) myTimeLine.hour = 0;
        else if (myTimeLine.hour >= 24) myTimeLine.hour = 23;
        setInputHour(myTimeLine.hour);
        onTimeLineChange(index, myTimeLine);
    };

    const handleMinuteChange = (value: string) => {
        myTimeLine.minute = parseInt(value);
        if (myTimeLine.minute < 0) myTimeLine.minute = 0;
        else if (myTimeLine.minute >= 60) myTimeLine.minute = 59;
        setInputMinute(myTimeLine.minute);
        onTimeLineChange(index, myTimeLine);
    };

    const handleThingChange = (value: string) => {
        myTimeLine.thing = value;
        setInputThing(myTimeLine.thing);
        onTimeLineChange(index, myTimeLine);
    };

    const changeInputType = (index: number) => {
        //console.log('changeType');
        let tempType: boolean[] = new Array(3).fill(false);
        switch(index) {
            case 0: tempType[0] = true; break;
            case 1: tempType[1] = true; break;
            case 2: tempType[2] = true; break;
        }
        setType(tempType);
        onStatusChange(index);
    };

    useEffect(() => {
        if (!status) {
            const tempType: boolean[] = new Array(3).fill(false);
            setType(tempType);
        }
    }, [status]);

    return (
        <>
            <div style={{ display: 'inline-block' }}>
            {type[0] ? <input type="number" value={inputHour}
                onChange={e => (handleHourChange(e.target.value))} />
                : <button onClick={() => changeInputType(0)}>{inputHour}</button>}
            <span>:</span>
            {type[1] ? <input type="number" value={inputMinute}
                onChange={e => (handleMinuteChange(e.target.value))} />
                : <button onClick={() => changeInputType(1)}>{inputMinute}</button>}
            <span>-</span>
            {type[2] ? <input type="text" value={inputThing}
                onChange={e => (handleThingChange(e.target.value))} />
                : <button onClick={() => changeInputType(2)}>{inputThing}</button>}
            

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
