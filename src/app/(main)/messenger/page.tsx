'use client';

import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/store/use-auth-store';
import { useChatStore } from '@/store/use-chat-store';
import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { useCurrentMessages } from '@/store/use-current-messages';
import type { Message, RawMessage } from '@/types/chat.type';

import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessage from '@/components/chat/chat-message';
import ChatPanel from '@/components/chat/chat-panel';
import { JoinChatOverlay } from '@/components/chat/join-chat-overlay';
// Import JoinChatOverlay
import { ReplyBox } from '@/components/chat/reply-box';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { useSocketListener } from '@/hooks/use-socket-listener';

import { cn } from '@/utils';

// Function to generate a random avatar URL from DiceBear

export default function MessengerPage() {
    const { cancelReply, replyingTo } = useChatStore();
    const { fetchConversationBySlug, conversation, isLoading: isConvLoading } = useCommunityConversationStore();
    const { messages, addMessage, fetchMessages, sendMessage, isLoading: isMessagesLoading } = useCurrentMessages();
    const currentUser = useAuthStore((state) => state.user);
    const chatInputRef = useRef<{ focusEditor: () => void }>(null); // Ref to hold the ChatInput's custom focus function
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior,
            });
        }
    };

    useSocketListener<RawMessage>('chat:new_message', (data) => {
        console.log({ data });
        if (data.conversation_id.toString() !== conversation?.id.toString()) return;

        // Don't add if it's our own message (we added it optimistically or via response)
        // If we want to avoid duplicates:
        if (useCurrentMessages.getState().messages.some((m) => m.id.toString() === data.id.toString())) return;

        const isSystem = data.type === 'system' || data.sender_id.toString() === '0';
        let sender: Message['sender'] = 'other';

        if (isSystem) {
            sender = 'system';
        } else if (data.sender_id.toString() === currentUser?.id?.toString()) {
            sender = 'me';
        }

        const newMessage: Message = {
            id: data.id.toString(),
            text: data.content || '',
            content: data.content,
            sender,
            type: data.type as 'text' | 'system',
            metadata: data.metadata,
            time: data.created_at
                ? new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            created_at: data.created_at,
            name: data.sender?.name || (sender === 'me' ? 'Me' : 'Other'),
            avatar: data.sender?.picture || data.sender?.avatar,
        };

        addMessage(newMessage);
    });

    console.log('messages', messages);

    useEffect(() => {
        fetchConversationBySlug('community');
    }, [fetchConversationBySlug]);

    useEffect(() => {
        if (conversation?.id) {
            fetchMessages(conversation.id);
        }
    }, [conversation?.id, fetchMessages]);

    useEffect(() => {
        if (replyingTo && chatInputRef.current) {
            chatInputRef.current.focusEditor();
        }
    }, [replyingTo]);

    useEffect(() => {
        if (!isMessagesLoading && messages.length > 0) {
            // Delay slightly to ensure content is rendered
            const timer = setTimeout(() => {
                scrollToBottom('smooth');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messages, isMessagesLoading]);

    const handleSendMessage = async (text: string) => {
        if (!conversation?.id) return;

        try {
            await sendMessage(conversation.id, text, replyingTo?.id);
            cancelReply();
        } catch (error) {
            console.error('Error in handleSendMessage:', error);
        }
    };

    if (isConvLoading || isMessagesLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!conversation) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Failed to load conversation.</p>
            </div>
        );
    }

    return (
        <div className={cn('flex h-full bg-background overflow-hidden border-x border-border')}>
            <div className="flex flex-1 flex-col min-w-0">
                <ChatHeader
                    title={conversation.title}
                    thumbnailUrl={conversation.thumbnail_url}
                    onlineUserCount={conversation.onlineCount || 0}
                />
                <ScrollableView ref={scrollRef} className="flex-1 px-4" vertical>
                    <div className="flex flex-col gap-2 py-4 w-full">
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                id={msg.id}
                                text={msg.text}
                                sender={msg.sender}
                                time={msg.time || ''}
                                name={msg.name}
                                avatar={msg.avatar}
                                readBy={msg.readBy}
                                type={msg.type}
                                metadata={msg.metadata}
                                content={msg.content}
                            />
                        ))}
                    </div>
                </ScrollableView>

                <ReplyBox />
                <ChatInput onSend={handleSendMessage} ref={chatInputRef} />
            </div>
            <ChatPanel />
            {!conversation.is_joined && <JoinChatOverlay />}
        </div>
    );
}
