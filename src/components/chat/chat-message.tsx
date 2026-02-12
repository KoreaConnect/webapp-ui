'use client';

import React from 'react';

import { useChatStore } from '@/store/use-chat-store';

import Avatar from '@/components/ui/avatar';

import { cn } from '@/utils/cn';

import { MessageContent } from './message-content';
import MessageTools from './message-tools';

type ChatMessageProps = {
    id: string;
    text: string;
    sender: 'me' | 'other';
    time: string;
    avatar?: string;
    name?: string;
};

function ChatMessage({ id, text, sender, time, avatar, name }: ChatMessageProps) {
    const messageReactions = useChatStore((state) => state.messageReactions[id]);
    const reactions = messageReactions ?? {};

    return (
        <div key={id} className={cn('group relative flex w-full', sender === 'me' ? 'justify-end' : 'justify-start')}>
            <div className={cn('flex items-start gap-2 max-w-[85%]', sender === 'me' && 'flex-row-reverse')}>
                <Avatar
                    src={avatar}
                    alt={name}
                    fallback={name?.slice(0, 1).toUpperCase()}
                    size="sm"
                    className="mt-1 shrink-0"
                />

                <div className={cn('flex flex-col', sender === 'me' ? 'items-end' : 'items-start')}>
                    <div className={cn('flex items-center gap-2', sender === 'me' && 'flex-row-reverse')}>
                        <MessageContent text={text} sender={sender} time={time} reactions={reactions} />
                        <MessageTools messageId={id} position={sender === 'me' ? 'right' : 'left'} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;
