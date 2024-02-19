import React, { useEffect } from 'react'

export default function Timer({ seconds, timerRunning, setSeconds }) {

    useEffect(() => {
        let timerId;
        if (timerRunning) {
            timerId = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        }
        return () => {
            clearInterval(timerId);
        };
    }, [timerRunning]);
    console.log('aqui')
    return (
        <div>{seconds}</div>
    )
}
