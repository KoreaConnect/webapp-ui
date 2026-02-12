import React from 'react';

import { cn } from '@/utils/cn';

type ReactionGroupProps = {
    reactions: Record<string, string[]>;
    sender: 'me' | 'other';
    className?: string;
};

export const ReactionGroup: React.FC<ReactionGroupProps> = ({ reactions, sender, className }) => {
    const reactionEntries = Object.entries(reactions).filter(([, users]) => users.length > 0);

    if (reactionEntries.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'relative -top-3 mt-1 flex flex-wrap items-center gap-1',
                sender === 'me' ? 'justify-end' : 'justify-start',
                className,
            )}
        >
            {reactionEntries.map(([emoji, users]) => (
                <div
                    key={emoji}
                    className="flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full px-2 py-0.5 shadow-sm border border-zinc-100 dark:border-zinc-700 text-xs select-none"
                >
                    <span>{emoji}</span>
                    {users.length > 0 && <span className="ml-1 text-zinc-500">{users.length}</span>}
                </div>
            ))}
        </div>
    );
};
