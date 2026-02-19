import React from 'react';

import type { ReadReceipt } from '@/types/chat.type';

import { cn } from '@/utils/cn';

import { ReactionGroup } from './reaction-group';

type MessageContentProps = {
    text: string;
    sender: 'me' | 'other';
    time: string;
    reactions: Record<string, string[]>;
    readBy?: ReadReceipt[];
};

export function MessageContent({ text, sender, time, reactions, readBy }: MessageContentProps) {
    return (
        <div
            className={cn(
                'max-w-[50vw] md:max-w-[calc(50vw-var(--sidebar-width)+100px)] lg:max-w-[400px] xl:max-w-[500px]',
            )}
        >
            <div
                className={cn(
                    'rounded-2xl p-3 text-sm break-words shadow-sm mb-2',
                    sender === 'me'
                        ? 'bg-primary rounded-tr-none text-white'
                        : 'bg-zinc-200 text-zinc-800 rounded-tl-none dark:bg-zinc-800 dark:text-zinc-100',
                )}
            >
                <p className="whitespace-pre-wrap">{text}</p>

                <span className={cn('mt-1 block text-[10px]', sender === 'me' ? 'text-blue-100' : 'text-zinc-500')}>
                    {time}
                </span>
            </div>

            <ReactionGroup reactions={reactions} sender={sender} />
        </div>
    );
}
