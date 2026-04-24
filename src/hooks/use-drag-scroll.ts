import { useCallback, useRef, useState } from 'react';

export const useDragScroll = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (!scrollRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);

        // Prevent text selection while dragging
        scrollRef.current.style.cursor = 'grabbing';
        scrollRef.current.style.userSelect = 'none';
    }, []);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
        if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grab';
            scrollRef.current.style.removeProperty('user-select');
        }
    }, []);

    const onMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging || !scrollRef.current) return;

            e.preventDefault();
            const x = e.pageX - scrollRef.current.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed multiplier
            scrollRef.current.scrollLeft = scrollLeft - walk;
        },
        [isDragging, scrollLeft, startX],
    );

    return {
        scrollRef,
        onMouseDown,
        onMouseUp,
        onMouseLeave: onMouseUp,
        onMouseMove,
        style: { cursor: 'grab' } as const,
    };
};
