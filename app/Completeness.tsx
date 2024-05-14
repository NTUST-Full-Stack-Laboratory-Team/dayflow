"use client"
import React from 'react';
import { Flex, Progress } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import type { ProgressProps } from 'antd';

export default function Completeness({ percent }: { percent: number}) {
    const conicColors: ProgressProps['strokeColor'] = {
        '0%': '#C4BBAF',
        '50%': '#C7B6A1',
        '100%': '#CEA282',
    };

    return (
        <>
            <div className='w-50%'>
                <Progress percent={percent} size={["90%", 20]} strokeColor={conicColors} />
            </div>
        </>
    )
}