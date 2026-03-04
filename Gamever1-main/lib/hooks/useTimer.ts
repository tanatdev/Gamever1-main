'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialSeconds = 0) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);

    const toggle = useCallback(() => setIsActive(a => !a), []);

    const reset = useCallback(() => {
        setSeconds(initialSeconds);
        setIsActive(false);
    }, [initialSeconds]);

    const start = useCallback(() => setIsActive(true), []);
    const stop = useCallback(() => setIsActive(false), []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds]);

    const formattedTime = `${Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    return { seconds, isActive, toggle, reset, start, stop, formattedTime };
}
