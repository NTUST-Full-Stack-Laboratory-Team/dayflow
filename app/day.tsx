"use client"
import moment from "moment";
import { useState } from "react";
import { Button, Dropdown } from 'antd';

export default function Day() {
    const [month, setMonth] = useState(moment().format("M"));
    const [day, setDay] = useState(moment().format("D"));
    const [weekday, setWeekday] = useState(moment().format("dddd"));

    const handleMonthClick = (num: string) => {
        setMonth(num);
    }

    const handleDayClick = (num: string) => {
        setDay(num);
    }

    const generateMenuItems = (start: number, end: number, handleClick: (num: string) => void) => {
        return Array.from({ length: end - start + 1 }, (_, i) => {
            const value = start + i;
            return {
                key: String(value),
                label: (
                    <div onClick={() => handleClick(String(value))}>{value}</div>
                )
            };
        });
    };

    const monthItems = generateMenuItems(1, 12, handleMonthClick);
    const dayItems = generateMenuItems(1, 31, handleDayClick);

    return (
        <div className="flex flex-col items-start">
            <div className="flex items-center font-jacques-Francois text-2xl text-slate-500 bg-[#D9D9D9] w-32 h-10 pl-2">{weekday}</div>
            <br />
            <div className="flex flex-row items-center">
                <Dropdown menu={{ items: monthItems }} placement="bottomLeft" trigger={['click']}>
                    <Button className="font-jacques-Francois text-xl" type="text">{month}</Button>
                </Dropdown>
                <div className="font-jacques-Francois text-2xl">/</div>
                <Dropdown menu={{ items: dayItems }} placement="bottomLeft" trigger={['click']}>
                    <Button className="font-jacques-Francois text-xl" type="text">{day}</Button>
                </Dropdown>
            </div>
        </div>
    );
}
