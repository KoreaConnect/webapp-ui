import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

import { cn } from '@/utils/cn';

interface MentionListProps {
    items: { id: string; name: string }[];
    command: (item: { id: string; name: string }) => void;
}

export const MentionList = forwardRef<unknown, MentionListProps>(({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
        (index: number) => {
            const item = items[index];
            if (item) {
                command(item);
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
        <div className="relative z-50 p-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg">
            {items.map((item, index) => (
                <button
                    key={item.id}
                    className={cn(
                        'block w-full text-left px-2 py-1 rounded-sm text-sm',
                        index === selectedIndex
                            ? 'bg-primary text-white'
                            : 'text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700',
                    )}
                    onClick={() => selectItem(index)}
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
});

MentionList.displayName = 'MentionList';
