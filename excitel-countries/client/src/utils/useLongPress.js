import { useCallback, useEffect, useRef, useState } from 'react';

const useLongPress = ({ onLongPress, ms = 1500, tickMs = 30 } = {}) => {
    const [progress, setProgress] = useState(0);
    const [isPressing, setIsPressing] = useState(false);
    const startedAtRef = useRef(0);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const clear = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        intervalRef.current = null;
        timeoutRef.current = null;
    }, []);

    const start = useCallback((event) => {
        if (event.button !== undefined && event.button !== 0) return;
        startedAtRef.current = Date.now();
        setIsPressing(true);
        setProgress(0);

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startedAtRef.current;
            setProgress(Math.min(1, elapsed / ms));
        }, tickMs);

        timeoutRef.current = setTimeout(() => {
            clear();
            setProgress(1);
            onLongPress?.();
            setIsPressing(false);
            setProgress(0);
        }, ms);
    }, [ms, tickMs, clear, onLongPress]);

    const cancel = useCallback(() => {
        clear();
        setIsPressing(false);
        setProgress(0);
    }, [clear]);

    useEffect(() => clear, [clear]);

    const handlers = {
        onMouseDown: start,
        onMouseUp: cancel,
        onMouseLeave: cancel,
        onTouchStart: start,
        onTouchEnd: cancel,
        onTouchCancel: cancel,
    };

    return { handlers, progress, isPressing };
};

export default useLongPress;
