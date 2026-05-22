'use client';

import * as React from 'react';

import * as ScrollArea from '@radix-ui/react-scroll-area';

import { cn } from '@/utils';

interface ScrollableViewProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    vertical?: boolean;
    horizontal?: boolean;
    className?: string;
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export const ScrollableView = React.forwardRef<HTMLDivElement, ScrollableViewProps>(
    ({ children, vertical = true, horizontal = false, className = '', onScroll, ...props }, ref) => {
        return (
            <ScrollArea.Root className={cn('relative overflow-hidden w-full h-full', className)}>
                <ScrollArea.Viewport
                    ref={ref}
                    className={cn('h-full w-full', !horizontal && '[&>div]:!block')}
                    onScroll={onScroll}
                    {...props}
                >
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
