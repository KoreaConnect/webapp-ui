'use client';

import { useState } from 'react';

import { Send } from 'lucide-react';

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollableView } from '@/components/ui/scrollable-view';

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
    const [selectedChat, setSelectedChat] = useState(DUMMY_CHATS[0]);
    const [message, setMessage] = useState('');

    return (
        <div className="flex h-full bg-background overflow-hidden">
            {/* Chat List */}
            <div className="w-full md:w-80 border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                    <h1 className="text-xl font-bold">Messages</h1>
                </div>
                <ScrollableView className="flex-1">
                    <div className="flex flex-col">
                        {DUMMY_CHATS.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`flex items-center gap-3 p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100 text-left w-full
                                    ${selectedChat.id === chat.id ? 'bg-zinc-50' : ''}
                                `}
                            >
                                <Avatar className="h-12 w-12" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold truncate">{chat.name}</h3>
                                        <span className="text-xs text-zinc-500">{chat.time}</span>
                                    </div>
                                    <p className="text-sm text-zinc-600 truncate">{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {chat.unread}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollableView>
            </div>

            {/* Chat Area */}
            <div className="hidden md:flex flex-1 flex-col">
                <div className="p-4 border-b border-border flex items-center gap-3">
                    <Avatar className="h-10 w-10" />
                    <div>
                        <h2 className="font-bold">{selectedChat.name}</h2>
                        <p className="text-xs text-green-500 font-medium">Online</p>
                    </div>
                </div>

                <ScrollableView className="flex-1 p-4">
                    <div className="flex flex-col gap-4">
                        {DUMMY_MESSAGES.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl p-3 text-sm
                                        ${
                                            msg.sender === 'me'
                                                ? 'bg-primary text-white rounded-tr-none'
                                                : 'bg-zinc-100 text-zinc-800 rounded-tl-none'
                                        }
                                    `}
                                >
                                    <p>{msg.text}</p>
                                    <span
                                        className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-blue-100' : 'text-zinc-500'}`}
                                    >
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollableView>

                <div className="p-4 border-t border-border">
                    <form
                        className="flex gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setMessage('');
                        }}
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-zinc-100 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                        <Button type="submit" size="icon" className="rounded-full">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
