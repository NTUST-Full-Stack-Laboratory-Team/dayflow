"use client";
import React from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

export default function Memo() {
    return (
        <>
            <TextArea variant="filled" style={{ resize: 'none' }}
                className='h-full' rows={7}/>
        </>
    )
}