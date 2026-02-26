'use client';

import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import Avatar from '@/components/ui/avatar';

import { cn } from '@/utils/cn';

export type MentionItem = {
    userId: string | number; // This is the actual numeric ID
    username: string; // This can be the username or fallback
    name: string;
    avatar?: string;
};

interface MentionListProps {
    items: MentionItem[];
    command: (item: { id: string; userId: string | number; label: string }) => void;
}

export const MentionList = forwardRef<unknown, MentionListProps>(({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
        (index: number) => {
            const item = items[index];
            if (item) {
                // Tiptap's mention extension expects 'id' and optionally 'label'.
                // We map 'username' to 'id' for the extension's default behavior,
                // and pass 'userId' as our custom attribute.
                command({
                    id: item.username,
                    userId: item.userId,
                    label: item.name,
                });
            }
        },
        [command, items],
    );

    const upHandler = useCallback(() => {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    }, [selectedIndex, items.length]);

    const downHandler = useCallback(() => {
        setSelectedIndex((selectedIndex + 1) % items.length);
    }, [selectedIndex, items.length]);

    const enterHandler = useCallback(() => {
        selectItem(selectedIndex);
    }, [selectItem, selectedIndex]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }
            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }
            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }
            return false;
        },
    }));

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="relative z-50 p-1">
            {items.map((item, index) => (
                <button
                    key={item.userId}
                    className={cn(
                        'flex items-center gap-2 w-full text-left px-2 py-1 rounded-sm text-sm',
                        index === selectedIndex
                            ? 'bg-primary text-white'
                            : 'text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700',
                    )}
                    onClick={() => selectItem(index)}
                >
                    <Avatar src={item.avatar} alt={item.name} fallback={item.name.charAt(0).toUpperCase()} size="sm" />
                    <span>{item.name}</span>
                </button>
            ))}
        </div>
    );
});

MentionList.displayName = 'MentionList';
