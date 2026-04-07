'use client';

import ChatInterface from '@/app/messenger/_components/chat-interface';
import { MessengerSidebarProvider } from '@/context/messenger-sidebar-context';

export default function CommunityChat() {
    return (
        <MessengerSidebarProvider>
            <ChatInterface conversationSlug="community" />;
        </MessengerSidebarProvider>
    );
}
