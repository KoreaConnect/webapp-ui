'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { Message } from '@/types/chat.type';

interface ReplyContextType {
    isOpenReplyBox: boolean;
    closeReplyBox: () => void;
    setIsReplyBoxOpen: (isOpen: boolean) => void;
    replyingTo: Message | null;
    setReplyingTo: (message: Message | null) => void;
    openReplyBox: (message: Message) => void;
}

const ReplyContext = createContext<ReplyContextType | undefined>(undefined);

export function useReply() {
    const context = useContext(ReplyContext);
    if (context === undefined) {
        throw new Error('useReply must be used within a ReplyProvider');
    }
    return context;
}

export function ReplyProvider({ children }: { children: ReactNode }) {
    const [isOpenReplyBox, setIsReplyBoxOpen] = useState(false);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);

    const closeReplyBox = () => {
        setIsReplyBoxOpen(false);
        setTimeout(() => {
            setReplyingTo(null);
        }, 300); // Match the transition duration in ReplyBox.tsx
    };

    const openReplyBox = (message: Message) => {
        setIsReplyBoxOpen(true);
        setReplyingTo(message);
    };

    return (
        <ReplyContext.Provider
            value={{ isOpenReplyBox, closeReplyBox, setIsReplyBoxOpen, replyingTo, setReplyingTo, openReplyBox }}
        >
            {children}
        </ReplyContext.Provider>
    );
}
