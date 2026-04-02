import React from 'react';

import { BasicUserInfo, MESSAGE_ROLE, MessageReactions, MessageRole } from '@/types/chat.type';

import { cn } from '@/utils/cn';

import { REACTIONS } from './reaction-picker';

type ReactionGroupProps = {
    reactions: MessageReactions;
    sender: MessageRole;
    className?: string;
};

export const ReactionGroup: React.FC<ReactionGroupProps> = ({ reactions, sender, className }) => {
    const reactionEntries = Object.entries(reactions).filter(([, users]) => users.length > 0);

    if (reactionEntries.length === 0) {
        return null;
    }

    const getReaction = (label: string) => {
        return REACTIONS.find((r) => r.label === label);
    };

    return (
        <div
            className={cn(
                'relative -top-4 flex flex-wrap items-center gap-1',
                sender === MESSAGE_ROLE.ME ? 'justify-end' : 'justify-start',
                className,
            )}
        >
            {reactionEntries.map(([type, users]) => {
                const reaction = getReaction(type);
                return (
                    <div
                        key={type}
                        className="flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full px-2 py-0.5 shadow-sm border border-zinc-100 dark:border-zinc-700 text-xs select-none"
                    >
                        {reaction ? <reaction.Icon width={16} height={16} className="shrink-0" /> : <span>{type}</span>}
                        {users.length > 0 && <span className="ml-1 text-zinc-500">{users.length}</span>}
                    </div>
                );
            })}
        </div>
    );
};
