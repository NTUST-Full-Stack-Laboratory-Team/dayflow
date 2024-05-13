"use client"
import React from 'react';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';

export default function Day() {
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    return (
        <div className="flex flex-col items-start">
            <div className="flex items-center font-jacques-Francois text-2xl text-slate-500 bg-[#D9D9D9] w-32 h-10 pl-2">Date-</div>
            <br />
            <DatePicker onChange={onChange} />
        </div>
    );
}
