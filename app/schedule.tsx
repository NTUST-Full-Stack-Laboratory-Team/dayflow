"use client";
import React, { useState, useEffect } from "react";

type Time = {
    hour: number;
    minute: number;
    thing: string;
}

export default function Schedule() {
    const [schedule, setSchedule] = useState<Time[]>([]);

    useEffect(() => {
        console.log('render');
      });

    const handleClick = () => {
        let newTime: Time = {
            hour: 0,
            minute: 0,
            thing: ""
        }
        
        let newSchedule = [...schedule.slice(), newTime];
        setSchedule(newSchedule);
    };

    const handleTimeLine = (index: number, value: Time) => {
        let newSchedule: Array<Time> = schedule.slice();
        newSchedule[index] = value;
        setSchedule(newSchedule);
    };

    return (
        <>
        {schedule.map((value, index) => (
            <TimeLine index={index} myTimeLine={value} onTimeLineChange={() => handleTimeLine} key={`timeLine_${index}`}/>
        ))}
            <button onClick={handleClick}>add new timeLine</button>
            <div>{schedule.length}</div>
        </>
    );
}

const TimeLine: React.FC<{ index: number; myTimeLine: Time; onTimeLineChange: (index: number, value: Time) => void }> = ({ index, myTimeLine, onTimeLineChange }) => {
    const [input, setInput] = useState("");

    //const handleSelectHours = (hour: number) => {    };
    const handleChange = (index: number, value: string) => {
        switch(index) {
            case 0: 
                myTimeLine.hour = parseInt(value);
                break;
            case 1: 
                myTimeLine.minute = parseInt(value);
                break;
            case 2: 
                myTimeLine.thing = value;
                break;
        }

        onTimeLineChange(index, myTimeLine);
    };

    return (
        <>
            <div style={{ display: 'inline-block' }}>
                <SelectHours hour={myTimeLine.hour} handleChange={handleChange}/>
                <span>:</span>
                <SelectMinutes minute={myTimeLine.minute} handleChange={handleChange}/>
                <span>-</span>
                <input type="text" value={myTimeLine.thing}
                    onChange={e => (handleChange(2, e.target.value))} />
            </div>

        </>
    );
}

function SelectHours({ hour, handleChange }: 
    { hour: number ; handleChange: (index: number, value: string) => void }) {
    const numbers = Array.from({ length: 24 }, (_, index) => index);

    return (
        <select name="hour" defaultValue={hour} onChange={(e) => handleChange(0, e.target.value)}>
            <option key={"hour_disable"} value={""} disabled hidden></option>
            {numbers.map((number) => (
                <option key={`hour_${number}`} value={number}>{number}</option>
            ))}
        </select>
    );
}

function SelectMinutes({ minute, handleChange }: 
    { minute: number; handleChange: (index: number, value: string) => void }) {
    const numbers = Array.from({ length: 12 }, (_, index) => index * 5);

    return (
        <select name="minute" defaultValue={minute} onChange={(e) => handleChange(1, e.target.value)}>
            <option key={"minute_disable"} value={""} disabled hidden></option>
            {numbers.map((number) => (
                <option key={`minute_${number}`} value={number}>{number}</option>
            ))}
        </select>
    );
}