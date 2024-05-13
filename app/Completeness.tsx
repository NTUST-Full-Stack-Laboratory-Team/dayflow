"use client"
import React, { useEffect, useState } from 'react';
import { Flex, Progress } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import type { ProgressProps } from 'antd';

export default function Completeness() {
    //const storedData = localStorage.getItem("taskCompleteness");
    //const percent = storedData ? JSON.parse(storedData) : 0;
    const conicColors: ProgressProps['strokeColor'] = {
        '0%': '#C4BBAF',
        '50%': '#C7B6A1',
        '100%': '#CEA282',
    };

    return (
        <>
            <div className='w-50%'>
                <Progress percent={100} size={["90%", 20]} strokeColor={conicColors} />
            </div>
        </>
    )
}