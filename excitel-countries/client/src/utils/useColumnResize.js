import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

const MIN_WIDTH = 80;

const useColumnResize = (containerRef, columnCount) => {
    const [ratios, setRatios] = useState(() => Array(columnCount).fill(1 / columnCount));
    const [containerWidth, setContainerWidth] = useState(0);
    const ratiosRef = useRef(ratios);
    ratiosRef.current = ratios;
    const containerWidthRef = useRef(containerWidth);
    containerWidthRef.current = containerWidth;

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const initial = container.clientWidth;
        if (initial > 0) setContainerWidth(initial);

        const observer = new ResizeObserver(([entry]) => {
            const w = entry.contentRect.width;
            if (w > 0) setContainerWidth(prev => (Math.abs(prev - w) > 0.5 ? w : prev));
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, [containerRef]);

    const widths = useMemo(() => {
        if (containerWidth <= 0) return ratios.map(() => 0);
        const sum = ratios.reduce((a, b) => a + b, 0) || 1;
        return ratios.map(r => Math.max(MIN_WIDTH, (r / sum) * containerWidth));
    }, [ratios, containerWidth]);

    const startResize = useCallback((index) => (event) => {
        if (index >= columnCount - 1) return;
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();

        const target = event.currentTarget;
        const pointerId = event.pointerId;
        target.setPointerCapture?.(pointerId);

        const startX = event.clientX;
        const startRatios = ratiosRef.current;
        const startContainer = containerWidthRef.current;
        if (startContainer <= 0) return;

        const minRatio = MIN_WIDTH / startContainer;
        const sumPair = startRatios[index] + startRatios[index + 1];
        const upper = sumPair - minRatio;

        const handleMove = (e) => {
            const deltaRatio = (e.clientX - startX) / startContainer;
            const proposed = startRatios[index] + deltaRatio;
            const newRi = Math.max(minRatio, Math.min(upper, proposed));
            const newRiNext = sumPair - newRi;
            setRatios(prev => prev.map((r, i) => {
                if (i === index) return newRi;
                if (i === index + 1) return newRiNext;
                return r;
            }));
        };

        const handleEnd = () => {
            target.removeEventListener('pointermove', handleMove);
            target.removeEventListener('pointerup', handleEnd);
            target.removeEventListener('pointercancel', handleEnd);
            target.releasePointerCapture?.(pointerId);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        target.addEventListener('pointermove', handleMove);
        target.addEventListener('pointerup', handleEnd);
        target.addEventListener('pointercancel', handleEnd);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, [columnCount]);

    return { widths, startResize };
};

export default useColumnResize;
