"use client";
import { useState } from "react";

export default function Schedule() {
    return (
        <>
            <TimeLine />
        </>
    );
}

function TimeLine() {
    const [input, setInput] = useState("");
    const handleSelect = (e) => this

    return (
        <>
            <select onChange={e => handleSelect(e)}></select>
            <input type="text" value={input}
                onChange={e => (setInput(e.target.value))} />

        </>
    );
}