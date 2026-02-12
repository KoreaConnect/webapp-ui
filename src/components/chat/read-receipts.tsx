'use client';

import React, { useEffect, useRef } from 'react';

import type { ReadReceipt } from '@/types/chat.type';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import Avatar from '@/components/ui/avatar';

import { cn } from '@/utils/cn';

type ReadReceiptsProps = {
    readBy: ReadReceipt[];
    sender: 'me' | 'other';
};

export function ReadReceipts({ readBy, sender }: ReadReceiptsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const elements = containerRef.current.querySelectorAll('[data-tippy-content]');
            const instances = tippy(Array.from(elements), {
                placement: 'top',
                animation: 'fade',
            });
            return () => {
                instances.forEach((instance) => instance.destroy());
            };
        }
    }, [readBy]);

    if (!readBy || readBy.length === 0) return null;

    const displayedReadBy = readBy.slice(0, 3);
    const remainingCount = readBy.length - 3;

    return (
        <div
            ref={containerRef}
            className={cn('absolute -bottom-4 flex items-center gap-1', sender === 'me' ? 'right-4' : 'left-4')}
        >
            <div className="flex -space-x-1.5 overflow-hidden">
                {displayedReadBy.map((user) => (
                    <div
                        key={user.userId}
                        data-tippy-content={`Read by ${user.name} at ${user.readAt}`}
                        className="inline-block ring-2 ring-background rounded-full transition-transform hover:scale-110 hover:z-10 cursor-help"
                    >
                        <Avatar src={user.avatar} alt={user.name} size={18} className="h-4 w-4" />
                    </div>
                ))}
            </div>
            {remainingCount > 0 && (
                <span className="text-[10px] text-muted-foreground font-medium">+{remainingCount}</span>
            )}
        </div>
    );
}
