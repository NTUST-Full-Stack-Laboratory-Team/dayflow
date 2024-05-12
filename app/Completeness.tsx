"use client"
import React, { useEffect, useState } from 'react';
import { Flex, Progress } from 'antd';

export default function Completeness(){
    //const storedData = localStorage.getItem("taskCompleteness");
    //const percent = storedData ? JSON.parse(storedData) : 0;

    return (
        <>
            <Progress percent={0} size="small" style={{ width: 180 }} />
        </>
    )
}