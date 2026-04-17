'use client';

import { useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { AxiosError } from 'axios';
import { MessageSquare, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DialogTitle, DialogWrapper } from '@/components/ui/dialog';

import { createPostConversation } from '@/services/conversation.service';

import { cn } from '@/utils';

interface SendPostMessageModalProps {
    postId: string | number;
    postType: 'airport_ride' | string;
    ownerId: number;
    ownerName: string;
    trigger?: React.ReactNode;
}

const RECOMMENDED_MESSAGES = [
    "Hi, I'm interested in sharing your ride!",
    'Is this ride still available?',
    'How many seats are left for this ride?',
    'Where is the exact meeting point?',
    "Hi! I'm going to the same airport, can I join?",
];

export function SendPostMessageModal({ postId, postType, ownerId, ownerName, trigger }: SendPostMessageModalProps) {
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { show } = useToastStore();
    const router = useRouter();

    const handleSend = async () => {
        if (!message.trim()) return;

        setIsLoading(true);
        try {
            const response = await createPostConversation({
                post_id: postId,
                post_type: postType,
                owner_id: ownerId,
                message: message.trim(),
            });

            if (response.success) {
                const conversation = response.data;
                show({
                    type: 'success',
                    title: 'Message Sent',
                    message: `Your message has been sent to ${ownerName}.`,
                });
                setIsOpen(false);
                setMessage('');
                router.push(`/messenger/${conversation.id}`);
            }
        } catch (error: unknown) {
            let errorMessage = 'Something went wrong. Please try again.';

            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            show({
                type: 'error',
                title: 'Failed to send message',
                message: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectRecommended = (msg: string) => {
        setMessage(msg);
    };

    return (
        <DialogWrapper open={isOpen} onOpenChange={setIsOpen} trigger={trigger}>
            <div className="relative p-6 space-y-6 bg-white dark:bg-zinc-950">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
                >
                    <X className="h-5 w-5 text-zinc-500" />
                </button>

                <div className="flex flex-col gap-1">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Message {ownerName}
                    </DialogTitle>
                    <p className="text-sm text-zinc-500">Send a message to coordinate.</p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Recommended Messages</h3>
                    <div className="flex flex-wrap gap-2">
                        {RECOMMENDED_MESSAGES.map((msg) => (
                            <button
                                key={msg}
                                onClick={() => handleSelectRecommended(msg)}
                                className={cn(
                                    'text-[13px] px-3.5 py-2 rounded-xl border transition-all text-left',
                                    message === msg
                                        ? 'bg-primary/10 border-primary/50 text-primary font-medium'
                                        : 'bg-zinc-50 dark:bg-zinc-900 border-border hover:border-primary/50 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800',
                                )}
                            >
                                {msg}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Your Message</h3>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        disabled={isLoading}
                        className="w-full h-32 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none text-sm disabled:opacity-50"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                        className="flex-1 rounded-xl h-12 font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim() || isLoading}
                        className="flex-1 rounded-xl h-12 font-bold gap-2 shadow-lg shadow-primary/20"
                    >
                        {isLoading ? (
                            'Sending...'
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send Message
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </DialogWrapper>
    );
}
