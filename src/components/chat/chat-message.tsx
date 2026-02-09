'use client';

import React, { useState } from 'react';

import { cn } from '@/utils/cn';

import { MessageActions } from './message-actions';
import { ReactionBadge } from './reaction-badge';
import { ReactionPicker } from './reaction-picker';

type ChatMessageProps = {
    id: string;
    text: string;
    sender: 'me' | 'other';
    time: string;
};

function ChatMessage({ id, text, sender, time }: ChatMessageProps) {
    const [reaction, setReaction] = useState<string | null>(null);

    const handleRemove = () => {
        // Implement remove logic
    };

    const handleReply = () => {
        // Implement reply logic
    };

    const handleReport = () => {
        // Implement report logic
    };

    return (
        <div key={id} className={cn('group relative mb-4 flex', sender === 'me' ? 'justify-end' : 'justify-start')}>
            <div className={cn('flex items-end gap-2', sender === 'me' && 'flex-row-reverse')}>
                <div
                    className={cn(
                        'relative max-w-[70%] rounded-2xl p-3 text-sm',
                        sender === 'me'
                            ? 'bg-primary rounded-tr-none text-white'
                            : 'bg-zinc-200 text-zinc-800 rounded-tl-none dark:bg-zinc-800 dark:text-zinc-100',
                    )}
                >
                    <p>{text}</p>
                    <span className={cn('mt-1 block text-[10px]', sender === 'me' ? 'text-blue-100' : 'text-zinc-500')}>
                        {time}
                    </span>

                    {reaction && <ReactionBadge reaction={reaction} sender={sender} />}
                </div>

                <div
                    className={cn(
                        'flex items-center opacity-0 transition-opacity group-hover:opacity-100',
                        sender === 'me' ? 'mr-1 flex-row-reverse' : 'ml-1',
                    )}
                >
                    <ReactionPicker
                        currentReaction={reaction}
                        onSelect={setReaction}
                        align={sender === 'me' ? 'end' : 'start'}
                    />

                    <MessageActions
                        sender={sender}
                        onReply={handleReply}
                        onRemove={handleRemove}
                        onReport={handleReport}
                        align={sender === 'me' ? 'end' : 'start'}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;
