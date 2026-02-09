'use client';

import React from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical } from 'lucide-react';

import { cn } from '@/utils/cn';

interface MessageActionsProps {
    sender: 'me' | 'other';
    onReply?: () => void;
    onRemove?: () => void;
    onReport?: () => void;
    align?: 'start' | 'end' | 'center';
    className?: string;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
    sender,
    onReply,
    onRemove,
    onReport,
    align = 'start',
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
                    <MoreVertical size={16} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    side="top"
                    align={align}
                    sideOffset={8}
                    className="min-w-[120px] bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 p-1 z-50 animate-in fade-in zoom-in duration-200"
                >
                    <DropdownMenu.Item
                        onClick={onReply}
                        className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none select-none"
                    >
                        Reply
                    </DropdownMenu.Item>

                    {sender === 'me' ? (
                        <DropdownMenu.Item
                            onClick={onRemove}
                            className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-500 outline-none select-none"
                        >
                            Remove Message
                        </DropdownMenu.Item>
                    ) : (
                        <DropdownMenu.Item
                            onClick={onReport}
                            className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-500 outline-none select-none"
                        >
                            Report
                        </DropdownMenu.Item>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
