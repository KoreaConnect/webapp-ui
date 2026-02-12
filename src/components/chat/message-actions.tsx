'use client';

import React from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Flag, MoreVertical, Trash2 } from 'lucide-react';

import { cn } from '@/utils/cn';

interface MessageActionsProps {
    sender: 'me' | 'other';
    onRemove?: () => void;
    onReport?: () => void;
    align?: 'start' | 'end' | 'center';
    className?: string;
    onOpenChange?: (open: boolean) => void;
}

const ICONS: Record<string, React.ElementType> = {
    delete: Trash2,
    report: Flag,
};

const COLORS: Record<string, string> = {
    danger: 'text-red-500',
    warning: 'text-yellow-500',
};

const ActionItem = ({
    label,
    icon,
    color,
    onClick,
}: {
    label: string;
    icon: string;
    color: string;
    onClick?: () => void;
}) => {
    const Icon = ICONS[icon];
    return (
        <DropdownMenu.Item
            onClick={onClick}
            className={cn(
                'flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none select-none',
                COLORS[color],
            )}
        >
            {Icon && <Icon size={16} />}
            <span>{label}</span>
        </DropdownMenu.Item>
    );
};

export const MessageActions: React.FC<MessageActionsProps> = ({
    className,
    sender,
    onRemove,
    onReport,
    align = 'start',
    onOpenChange,
}) => {
    const actions =
        sender === 'me'
            ? [{ label: 'Delete', action: 'delete', icon: 'delete', color: 'danger', handler: onRemove }]
            : [{ label: 'Report', action: 'report', icon: 'report', color: 'warning', handler: onReport }];

    return (
        <DropdownMenu.Root onOpenChange={onOpenChange}>
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
                    className="min-w-25 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 p-1 z-50 animate-in fade-in zoom-in duration-200"
                >
                    {actions.map((item) => (
                        <ActionItem
                            key={item.action}
                            label={item.label}
                            icon={item.icon}
                            color={item.color}
                            onClick={item.handler}
                        />
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
