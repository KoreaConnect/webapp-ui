'use client';

import { useState } from 'react';

import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ChatInputProps {
    onSend: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

function ChatInput({ onSend, placeholder = 'Type a message...', disabled = false }: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = message.trim();
        if (trimmedMessage) {
            onSend(trimmedMessage);
            setMessage('');
        }
    };

    return (
        <form className="flex gap-2 p-4 border-t border-border" onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none disabled:opacity-50"
            />
            <Button type="submit" size="icon" className="rounded-full" disabled={disabled || !message.trim()}>
                <Send className="h-4 w-4" />
            </Button>
        </form>
    );
}
export default ChatInput;
