'use client';

import React, { useEffect, useRef } from 'react';

import { useChatPanelStore } from '@/store/use-chat-panel-store';
import { useChatStore } from '@/store/use-chat-store';

import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessage from '@/components/chat/chat-message';
import ChatPanel from '@/components/chat/chat-panel';
import { ReplyBox } from '@/components/chat/reply-box';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { cn } from '@/utils';

export const DUMMY_MESSAGES = [
    {
        id: '1',
        text: 'Hello! I saw your post about the taxi share. Hello! I saw your post about the taxi share.',
        sender: 'other',
        time: '10:00 AM',
        name: 'John Doe',
    },
    { id: '2', text: 'Yes, it is still available. Where are you heading?', sender: 'me', time: '10:05 AM', name: 'Me' },
    { id: '3', text: 'I am going to the airport. Can I join?', sender: 'other', time: '10:30 AM', name: 'Jane Smith' },
    { id: '4', text: 'Sure, I can take you there.', sender: 'me', time: '10:35 AM', name: 'Me' },
    { id: '5', text: 'Great! What time should we meet?', sender: 'other', time: '10:40 AM', name: 'Jane Smith' },
    { id: '6', text: "Let's meet at 11:00 AM in front of the cafe.", sender: 'me', time: '10:45 AM', name: 'Me' },
    { id: '7', text: 'Sounds good. See you then!', sender: 'other', time: '10:50 AM', name: 'John Doe' },
    { id: '8', text: 'Goodbye!', sender: 'me', time: '10:55 AM', name: 'Me' },
    { id: '9', text: 'See you!', sender: 'other', time: '11:00 AM', name: 'Jane Smith' },
    { id: '10', text: 'Bye!', sender: 'me', time: '11:05 AM', name: 'Me' },
    { id: '11', text: 'See you later!', sender: 'other', time: '11:10 AM', name: 'John Doe' },
    { id: '12', text: 'Bye bye!', sender: 'me', time: '11:15 AM', name: 'Me' },
] as const;

export default function MessengerPage() {
    const { cancelReply, replyingTo } = useChatStore();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (replyingTo && inputRef.current) {
            inputRef.current.focus();
        }
    }, [replyingTo]);

    const handleSendMessage = (message: string) => {
        console.log('Sending message:', message);
        // In a real app, you would send this message to a backend
        // and clear the reply state
        cancelReply();
    };

    return (
        <div className={cn('flex h-full bg-background overflow-hidden border-x border-border  relative')}>
            <div className="flex flex-1 flex-col min-w-0">
                <ChatHeader title="Community Chat" thumbnailUrl="/images/community-avatar.png" onlineUserCount={12} />
                <ScrollableView className="flex-1 px-4">
                    <div className="flex flex-col gap-4 py-4">
                        {DUMMY_MESSAGES.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                id={msg.id}
                                text={msg.text}
                                sender={msg.sender}
                                time={msg.time}
                                name={msg.name}
                            />
                        ))}
                    </div>
                </ScrollableView>

                <ReplyBox />
                <ChatInput onSend={handleSendMessage} ref={inputRef} />
            </div>
            <ChatPanel />
        </div>
    );
}
