"use client";
import React from 'react';
import { Input, ConfigProvider } from 'antd';
const { TextArea } = Input;

export default function Memo() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgContainer: "rgba(0,0,0,0)",
                    colorBorder: "rgba(0,0,0,0)",
                    fontSize: 20,
                    fontFamily: "jacques-Francois",
                },
                components: {
                    Input: {
                        activeBg: "#D9D9D9",
                        activeBorderColor: "lightgray",
                        hoverBorderColor: "#D9D9D9",
                        hoverBg: "#D9D9D9"
                    }
                }
            }}
        >
            <TextArea style={{ resize: 'none' }}
                rows={7} styles={{ textarea: { height: "100%" } }} />
        </ConfigProvider >
    )
}