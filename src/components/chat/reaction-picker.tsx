'use client';

import React from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Smile } from 'lucide-react';

import { cn } from '@/utils/cn';

export const REACTIONS = [
    { emoji: '👍', label: 'like' },
    { emoji: '❤️', label: 'love' },
    { emoji: '😂', label: 'haha' },
    { emoji: '😮', label: 'wow' },
    { emoji: '😢', label: 'cry' },
    { emoji: '😡', label: 'angry' },
];

interface ReactionPickerProps {
    currentReaction?: string | null;
    onSelect: (emoji: string | null) => void;
    align?: 'start' | 'end' | 'center';
    side?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
    currentReaction,
    onSelect,
    align = 'start',
    side = 'top',
    className,
}) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    className={cn(
                        'p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer outline-none',
                        className,
                    )}
                >
                    <Smile size={16} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    side={side}
                    align={align}
                    sideOffset={8}
                    className="flex gap-1 p-1 bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200 z-50"
                >
                    {REACTIONS.map((r) => (
                        <DropdownMenu.Item
                            key={r.label}
                            onClick={() => onSelect(r.emoji === currentReaction ? null : r.emoji)}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer transition-transform hover:scale-125 outline-none"
                        >
                            <span className="text-xl leading-none select-none">{r.emoji}</span>
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
