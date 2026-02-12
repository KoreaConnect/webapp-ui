'use client';

import { useEffect, useRef } from 'react';

import { useChatPanelStore } from '@/store/use-chat-panel-store';
import { useChatStore } from '@/store/use-chat-store';
import type { ReadReceipt } from '@/types/chat';

import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessage from '@/components/chat/chat-message';
import ChatPanel from '@/components/chat/chat-panel';
import { JoinChatOverlay } from '@/components/chat/join-chat-overlay';
// Import JoinChatOverlay
import { ReplyBox } from '@/components/chat/reply-box';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { cn } from '@/utils';

// Define the type for DUMMY_MESSAGES
type Message = {
    id: string;
    text: string;
    sender: 'me' | 'other';
    time: string;
    name?: string;
    avatar?: string;
    readBy?: ReadReceipt[];
};

// Function to generate a random avatar URL from DiceBear
const generateAvatarUrl = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

export const DUMMY_MESSAGES: Message[] = [
    {
        id: '1',
        text: 'Hello! I saw your post about the taxi share. Hello! I saw your post about the taxi share.',
        sender: 'other',
        time: '10:00 AM',
        name: 'John Doe',
        avatar: generateAvatarUrl('John Doe'),
        readBy: [
            {
                userId: 'user_me',
                name: 'Me',
                avatar: generateAvatarUrl('Me'),
                readAt: '10:01 AM',
            },
        ],
    },
    {
        id: '2',
        text: 'Yes, it is still available. Where are you heading?',
        sender: 'me',
        time: '10:05 AM',
        name: 'Me',
        avatar: generateAvatarUrl('Me'),
        readBy: [
            {
                userId: '2',
                name: 'John Doe',
                avatar: generateAvatarUrl('John Doe'),
                readAt: '10:06 AM',
            },
            {
                userId: '3',
                name: 'Jane Smith',
                avatar: generateAvatarUrl('Jane Smith'),
                readAt: '10:07 AM',
            },
        ],
    },
    {
        id: '3',
        text: 'I am going to the airport. Can I join?',
        sender: 'other',
        time: '10:30 AM',
        name: 'Jane Smith',
        avatar: generateAvatarUrl('Jane Smith'),
        readBy: [
            {
                userId: 'user_me',
                name: 'Me',
                avatar: generateAvatarUrl('Me'),
                readAt: '10:31 AM',
            },
            {
                userId: '2',
                name: 'John Doe',
                avatar: generateAvatarUrl('John Doe'),
                readAt: '10:32 AM',
            },
        ],
    },
    {
        id: '4',
        text: 'Sure, I can take you there.',
        sender: 'me',
        time: '10:35 AM',
        name: 'Me',
        avatar: generateAvatarUrl('Me'),
        readBy: [
            {
                userId: '2',
                name: 'John Doe',
                avatar: generateAvatarUrl('John Doe'),
                readAt: '10:36 AM',
            },
            {
                userId: '3',
                name: 'Jane Smith',
                avatar: generateAvatarUrl('Jane Smith'),
                readAt: '10:37 AM',
            },
            {
                userId: '4',
                name: 'Alice',
                avatar: generateAvatarUrl('Alice'),
                readAt: '10:38 AM',
            },
            {
                userId: '5',
                name: 'Bob',
                avatar: generateAvatarUrl('Bob'),
                readAt: '10:39 AM',
            },
        ],
    },
    {
        id: '5',
        text: 'Great! What time should we meet?',
        sender: 'other',
        time: '10:40 AM',
        name: 'Jane Smith',
        avatar: generateAvatarUrl('Jane Smith'),
        readBy: [],
    },
    {
        id: '6',
        text: "Let's meet at 11:00 AM in front of the cafe.",
        sender: 'me',
        time: '10:45 AM',
        name: 'Me',
        avatar: generateAvatarUrl('Me'),
    },
    {
        id: '7',
        text: 'Sounds good. See you then!',
        sender: 'other',
        time: '10:50 AM',
        name: 'John Doe',
        avatar: generateAvatarUrl('John Doe'),
    },
    { id: '8', text: 'Goodbye!', sender: 'me', time: '10:55 AM', name: 'Me', avatar: generateAvatarUrl('Me') },
    {
        id: '9',
        text: 'See you!',
        sender: 'other',
        time: '11:00 AM',
        name: 'Jane Smith',
        avatar: generateAvatarUrl('Jane Smith'),
    },
    { id: '10', text: 'Bye!', sender: 'me', time: '11:05 AM', name: 'Me', avatar: generateAvatarUrl('Me') },
    {
        id: '11',
        text: 'See you later!',
        sender: 'other',
        time: '11:10 AM',
        name: 'John Doe',
        avatar: generateAvatarUrl('John Doe'),
    },
    { id: '12', text: 'Bye bye!', sender: 'me', time: '11:15 AM', name: 'Me', avatar: generateAvatarUrl('Me') },
];

export default function MessengerPage() {
    const { cancelReply, replyingTo, hasJoined } = useChatStore();
    const chatInputRef = useRef<{ focusEditor: () => void }>(null); // Ref to hold the ChatInput's custom focus function

    useEffect(() => {
        if (replyingTo && chatInputRef.current) {
            chatInputRef.current.focusEditor();
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
                    <div className="flex flex-col gap-2 py-4">
                        {DUMMY_MESSAGES.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                id={msg.id}
                                text={msg.text}
                                sender={msg.sender}
                                time={msg.time}
                                name={msg.name}
                                avatar={msg.avatar}
                                readBy={msg.readBy}
                            />
                        ))}
                    </div>
                </ScrollableView>

                <ReplyBox />
                <ChatInput onSend={handleSendMessage} ref={chatInputRef} />
            </div>
            <ChatPanel />
            {/* {!hasJoined && <JoinChatOverlay />} */}
        </div>
    );
}
