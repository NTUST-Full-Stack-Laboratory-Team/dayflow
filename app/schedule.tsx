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
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        console.log('Schedule render');
        localStorage.setItem("mySchedule", JSON.stringify(schedule));
    }, [Schedule]);

    useEffect(() => {
        console.log('render');
        schedule.map((value, _) => {
            console.log(value.hour + ":" + value.minute + "-" + value.thing);
        })
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

    const addLabels = (value: string) => {
        setLabels([...labels.slice(), value]);
    };

    return (
        <>
            {schedule.map((value, index) => (
                <TimeLine index={index} myTimeLine={value} onTimeLineChange={() => handleTimeLine} key={`timeLine_${index}`}/>
            ))}
            <button onClick={handleClick}>add new timeLine</button>
            <div>{schedule.length}</div>
            {schedule.map((value, _) => (
                <div>{value.hour}:{value.minute}-{value.thing}</div>
            ))}
            <div>labels</div>
            <ul>
                {labels.map((value, index) => (
                    <li id={`labels_${index}`}>{value}</li>
                ))}
            </ul>
        </>
    );
}

const TimeLine: React.FC<{ index: number; myTimeLine: Time; onTimeLineChange: (index: number, value: Time) => void }> = ({ index, myTimeLine, onTimeLineChange }) => {
    const [inputHour, setInputHour] = useState<number>(myTimeLine.hour);
    const [inputMinute, setInputMinute] = useState<number>(myTimeLine.minute);
    const [inputThing, setInputThing] = useState<string>(myTimeLine.thing);

    useEffect(() => {
        console.log('TimeLine render');
    }, [myTimeLine]);

    const handleHourChange = (value: string) => {
        myTimeLine.hour = parseInt(value);
        setInputHour(myTimeLine.hour);
        onTimeLineChange(index, myTimeLine);
    };

    const handleMinuteChange = (value: string) => {
        myTimeLine.minute = parseInt(value);
        setInputMinute(myTimeLine.minute);
        onTimeLineChange(index, myTimeLine);
    };

    const handleThingChange = (value: string) => {
        myTimeLine.thing = value;
        setInputThing(myTimeLine.thing);
        onTimeLineChange(index, myTimeLine);
    };

    return (
        <>
            <div style={{ display: 'inline-block' }}>
                <input type="text" value={inputHour}
                    onChange={e => (handleHourChange(e.target.value))} />
                <span>:</span>
                <input type="text" value={inputMinute}
                    onChange={e => (handleMinuteChange(e.target.value))} />
                <span>-</span>
                <input type="text" value={inputThing}
                    onChange={e => (handleThingChange(e.target.value))} />
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
