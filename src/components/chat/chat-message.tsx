'use client';

import React from 'react';

import { useChatStore } from '@/store/use-chat-store';
import type { Message, MessageMetadata, ReadReceipt } from '@/types/chat.type';

import Avatar from '@/components/ui/avatar';

import { cn } from '@/utils/cn';

import { MessageContent } from './message-content';
import MessageTools from './message-tools';
import { ReadReceipts } from './read-receipts';
import { SystemMessage } from './system-message';

type ChatMessageProps = {
    id: string;
    text: string;
    sender: 'me' | 'other' | 'system';
    time: string;
    avatar?: string;
    name?: string;
    readBy?: ReadReceipt[];
    type?: 'text' | 'system';
    metadata?: MessageMetadata;
    content?: string;
    reply_to_message?: Message | null;
};

function ChatMessage({
    id,
    text,
    sender,
    time,
    avatar,
    name,
    readBy,
    type,
    metadata,
    content,
    reply_to_message,
}: ChatMessageProps) {
    const messageReactions = useChatStore((state) => state.messageReactions[id]);
    const reactions = messageReactions ?? {};

    if (type === 'system' || sender === 'system') {
        return <SystemMessage message={{ id, text, sender, type, metadata, content } as Message} />;
    }

    return (
        <div
            key={id}
            className={cn(
                'group relative flex flex-col w-full',
                sender === 'me' ? 'justify-end' : 'justify-start',
                sender === 'me' ? 'items-end' : 'items-start',
            )}
        >
            <div className={cn('flex items-start gap-2 w-full', sender === 'me' && 'flex-row-reverse')}>
                <Avatar src={avatar} alt={name} fallback={name?.slice(0, 1).toUpperCase()} size="sm" />

                <div className={cn('flex', sender === 'me' ? 'items-end' : 'items-start')}>
                    <div className={cn('flex items-center gap-2', sender === 'me' && 'flex-row-reverse')}>
                        <MessageContent
                            id={id}
                            text={text}
                            sender={sender}
                            time={time}
                            reactions={reactions}
                            readBy={readBy}
                            reply_to_message={reply_to_message}
                        />
                        <MessageTools messageId={id} position={sender === 'me' ? 'right' : 'left'} />
                    </div>
                </div>
            </div>
            <ReadReceipts readBy={readBy || []} sender={sender} />
        </div>
    );
}

export default ChatMessage;
