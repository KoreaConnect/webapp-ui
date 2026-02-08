'use client';

import { useChatPanelStore } from '@/store/use-chat-panel-store';

import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessage from '@/components/chat/chat-message';
import ChatPanel from '@/components/chat/chat-panel';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { cn } from '@/utils/cn';

const DUMMY_CHATS = [
    {
        id: '1',
        name: 'John Doe',
        lastMessage: 'Hey, is the taxi share still available?',
        time: '10:30 AM',
        unread: 2,
    },
    {
        id: '2',
        name: 'Jane Smith',
        lastMessage: 'I can help with the parcel delivery.',
        time: 'Yesterday',
        unread: 0,
    },
    {
        id: '3',
        name: 'Roommate Group',
        lastMessage: "Let's meet at 5 PM to discuss.",
        time: 'Monday',
        unread: 0,
    },
];

const DUMMY_MESSAGES = [
    { id: '1', text: 'Hello! I saw your post about the taxi share.', sender: 'other', time: '10:00 AM' },
    { id: '2', text: 'Yes, it is still available. Where are you heading?', sender: 'me', time: '10:05 AM' },
    { id: '3', text: 'I am going to the airport. Can I join?', sender: 'other', time: '10:30 AM' },
];

export default function MessengerPage() {
    const { isOpen, close } = useChatPanelStore();

    const handleSendMessage = (message: string) => {
        console.log('Sending message:', message);
        // In a real app, you would send this message to a backend
    };

    return (
        <div className="flex h-full bg-background overflow-hidden border border-border rounded-lg relative">
            {/* Mobile Backdrop */}

            <div className="flex flex-1 flex-col min-w-0">
                <ChatHeader title="Community Chat" thumbnailUrl="/images/community-avatar.png" onlineUserCount={12} />
                <ScrollableView className="flex-1 p-4">
                    <div className="flex flex-col gap-4">
                        {DUMMY_MESSAGES.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                id={msg.id}
                                text={msg.text}
                                sender={msg.id === '2' ? 'me' : 'other'}
                                time={msg.time}
                            />
                        ))}
                    </div>
                </ScrollableView>

                <ChatInput onSend={handleSendMessage} />
            </div>
            <ChatPanel />
        </div>
    );
}
