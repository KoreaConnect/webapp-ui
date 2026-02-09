import React from 'react';

import { cn } from '@/utils/cn';

interface ReactionBadgeProps {
    reaction: string;
    sender: 'me' | 'other';
    className?: string;
}

export const ReactionBadge: React.FC<ReactionBadgeProps> = ({ reaction, sender, className }) => {
    return (
        <div
            className={cn(
                'absolute -bottom-2 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full px-1 py-0.5 shadow-sm border border-zinc-100 dark:border-zinc-700 text-xs select-none',
                sender === 'me' ? 'right-0' : 'left-0',
                className,
            )}
        >
            {reaction}
        </div>
    );
};
