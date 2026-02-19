'use client';

import * as React from 'react';

import * as ScrollArea from '@radix-ui/react-scroll-area';

interface ScrollableViewProps {
    children: React.ReactNode;
    vertical?: boolean;
    horizontal?: boolean;
    className?: string;
}

export const ScrollableView = React.forwardRef<HTMLDivElement, ScrollableViewProps>(
    ({ children, vertical = true, horizontal = false, className = '' }, ref) => {
        return (
            <ScrollArea.Root className={`relative overflow-hidden ${className}`}>
                <ScrollArea.Viewport ref={ref} className="h-full w-full">
                    {children}
                </ScrollArea.Viewport>

                {vertical && (
                    <ScrollArea.Scrollbar orientation="vertical" className="flex touch-none select-none p-[2px] w-2">
                        <ScrollArea.Thumb className="flex-1 rounded-full bg-black/30 hover:bg-black/40" />
                    </ScrollArea.Scrollbar>
                )}

                {horizontal && (
                    <ScrollArea.Scrollbar orientation="horizontal" className="flex touch-none select-none p-[2px] h-2">
                        <ScrollArea.Thumb className="flex-1 rounded-full bg-black/30 hover:bg-black/40" />
                    </ScrollArea.Scrollbar>
                )}

                {vertical && horizontal && <ScrollArea.Corner className="bg-black/10" />}
            </ScrollArea.Root>
        );
    },
);

ScrollableView.displayName = 'ScrollableView';
