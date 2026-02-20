'use client';

import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/store/use-auth-store';
import { useChatStore } from '@/store/use-chat-store';
import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { mapRawMessageToMessage, useCurrentMessages } from '@/store/use-current-messages';
import type { RawMessage } from '@/types/chat.type';

import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessage from '@/components/chat/chat-message';
import ChatPanel from '@/components/chat/chat-panel';
import { JoinChatOverlay } from '@/components/chat/join-chat-overlay';
// Import JoinChatOverlay
import { ReplyBox } from '@/components/chat/reply-box';
import { Loader } from '@/components/ui/loader';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { useSocketListener } from '@/hooks/use-socket-listener';

import { cn } from '@/utils';

// Function to generate a random avatar URL from DiceBear

export default function MessengerPage() {
    const { cancelReply, replyingTo } = useChatStore();
    const { fetchConversationBySlug, conversation, isLoading: isConvLoading } = useCommunityConversationStore();
    const {
        messages,
        addMessage,
        fetchMessages,
        fetchMoreMessages,
        sendMessage,
        markAsRead,
        updateReadStatus,
        isLoading: isMessagesLoading,
        isFetchingMore,
        hasMore,
    } = useCurrentMessages();

    // Track the last seen message ID to avoid redundant markAsRead calls
    const lastReadMessageIdRef = useRef<string | null>(null);

    // read conversation - only when last message changes
    useEffect(() => {
        if (!conversation?.id || !conversation.is_joined || messages.length === 0 || isMessagesLoading) return;

        const lastMessage = messages[messages.length - 1];
        if (lastMessage.id !== lastReadMessageIdRef.current) {
            lastReadMessageIdRef.current = lastMessage.id;
            markAsRead(conversation.id, lastMessage.id);
        }
    }, [conversation?.id, conversation?.is_joined, messages, isMessagesLoading, markAsRead]);

    const currentUser = useAuthStore((state) => state.user);
    const chatInputRef = useRef<{ focusEditor: () => void }>(null); // Ref to hold the ChatInput's custom focus function
    const scrollRef = useRef<HTMLDivElement>(null);
    const lastScrollHeightRef = useRef<number>(0);
    const lastMessageIdRef = useRef<string | null>(null);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior,
            });
        }
    };

    const handleScroll = () => {
        if (!scrollRef.current || isFetchingMore || !hasMore || !conversation?.id) return;

        if (scrollRef.current.scrollTop === 0) {
            lastScrollHeightRef.current = scrollRef.current.scrollHeight;
            fetchMoreMessages(conversation.id);
        }
    };

    useEffect(() => {
        if (!isFetchingMore && lastScrollHeightRef.current > 0 && scrollRef.current) {
            const newScrollHeight = scrollRef.current.scrollHeight;
            scrollRef.current.scrollTop = newScrollHeight - lastScrollHeightRef.current;
            lastScrollHeightRef.current = 0;
        }
    }, [isFetchingMore]);

    useSocketListener<RawMessage>('chat:new_message', (data) => {
        if (data.conversation_id.toString() !== conversation?.id.toString()) return;

        // Don't add if it's our own message (we added it optimistically or via response)
        // If we want to avoid duplicates:
        if (useCurrentMessages.getState().messages.some((m) => m.id.toString() === data.id.toString())) return;

        const newMessage = mapRawMessageToMessage(data, currentUser?.id);

        addMessage(newMessage);
    });

    useSocketListener<{ message_id: string; conversation_id: string; user_id: string | number; reaction: string }>(
        'chat:reaction_added',
        (data) => {
            // Ignore if it's our own reaction (already handled optimistically)
            if (data.user_id.toString() === currentUser?.id.toString()) return;

            const { addReactionToState } = useChatStore.getState();
            addReactionToState(data.message_id, data.reaction, data.user_id.toString());
        },
    );

    useSocketListener<{ message_id: string; conversation_id: string; user_id: string | number; reaction: string }>(
        'chat:reaction_removed',
        (data) => {
            // Ignore if it's our own reaction (already handled optimistically)
            if (data.user_id.toString() === currentUser?.id.toString()) return;

            const { removeReactionFromState } = useChatStore.getState();
            removeReactionFromState(data.message_id, data.reaction, data.user_id.toString());
        },
    );

    useSocketListener<{
        conversation_id: string;
        user_id: string | number;
        last_read_message_id: string;
        last_read_message_at: string;
    }>('chat:read_status', (data) => {
        // Ignore if it's our own status (already handled by local actions)
        if (data.user_id.toString() === currentUser?.id.toString()) return;
        if (data.conversation_id.toString() !== conversation?.id.toString()) return;

        updateReadStatus(data.user_id.toString(), data.last_read_message_id, data.last_read_message_at);
    });

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
            const lastMessage = messages[messages.length - 1];

            // Only scroll to bottom if the last message has changed (new message arrived)
            // or if it's the first load
            if (lastMessage.id !== lastMessageIdRef.current) {
                lastMessageIdRef.current = lastMessage.id;
                // Delay slightly to ensure content is rendered
                const timer = setTimeout(() => {
                    scrollToBottom('smooth');
                }, 100);
                return () => clearTimeout(timer);
            }
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
                <Loader size={32} />
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
        <div className={cn('relative flex h-full bg-background overflow-hidden border-x border-border')}>
            <div className="flex flex-1 flex-col min-w-0">
                <ChatHeader
                    title={conversation.title}
                    thumbnailUrl={conversation.thumbnail_url}
                    onlineUserCount={conversation.onlineCount || 0}
                />
                <ScrollableView ref={scrollRef} className="flex-1 px-4" vertical onScroll={handleScroll}>
                    <div className="flex flex-col gap-2 py-4 pb-10  w-full">
                        {isFetchingMore && <Loader size={16} className="py-2" />}
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                id={msg.id}
                                text={msg.text}
                                sender={msg.sender}
                                time={msg.time || ''}
                                name={msg.name}
                                avatar={msg.sender === 'me' ? currentUser?.picture || msg.avatar : msg.avatar}
                                readBy={msg.readBy}
                                type={msg.type}
                                metadata={msg.metadata}
                                content={msg.content}
                                reply_to_message={msg.reply_to_message}
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
