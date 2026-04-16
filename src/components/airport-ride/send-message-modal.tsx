'use client';

import { useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { AirportRide } from '@/types/airport-ride.type';
import { MessageSquare, Send, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogTitle, DialogWrapper } from '@/components/ui/dialog';

import { cn } from '@/utils';

interface SendMessageModalProps {
    ride: AirportRide;
    trigger?: React.ReactNode;
}

const RECOMMENDED_MESSAGES = [
    "Hi, I'm interested in sharing your ride!",
    'Is this ride still available?',
    'How many seats are left for this ride?',
    'Where is the exact meeting point?',
    "Hi! I'm going to the same airport, can I join?",
];

export function SendMessageModal({ ride, trigger }: SendMessageModalProps) {
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { show } = useToastStore();

    const handleSend = () => {
        // TODO: Implement actual sending logic when API is available
        console.log(`Sending message to ${ride.user.name}: ${message}`);

        show({
            type: 'success',
            title: 'Message Sent',
            message: `Your message has been sent to ${ride.user.name}.`,
        });

        setIsOpen(false);
        setMessage('');
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
                        Message {ride.user.name}
                    </DialogTitle>
                    <p className="text-sm text-zinc-500">Send a message to coordinate your ride sharing.</p>
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
                        className="w-full h-32 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none text-sm"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 rounded-xl h-12 font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="flex-1 rounded-xl h-12 font-bold gap-2 shadow-lg shadow-primary/20"
                    >
                        <Send className="h-4 w-4" />
                        Send Message
                    </Button>
                </div>
            </div>
        </DialogWrapper>
    );
}
