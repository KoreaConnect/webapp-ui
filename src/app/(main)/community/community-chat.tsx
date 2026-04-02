'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useReply } from '@/context/reply-context';
import { useAuthStore } from '@/store/use-auth-store';
import { useChatPanelStore } from '@/store/use-chat-panel-store';
import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { mapRawMessageToMessage, useCurrentMessages } from '@/store/use-current-messages';
import { useMessageReactionStore } from '@/store/use-message-reaction-store';
import { useToastStore } from '@/store/use-toast-store';
import { BasicUserInfo, MESSAGE_ROLE, type RawMessage } from '@/types/chat.type';

import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessage from '@/components/chat/chat-message';
import ChatPanel from '@/components/chat/chat-panel';
import ChatSearchBar from '@/components/chat/chat-search-bar';
import { JoinChatOverlay } from '@/components/chat/join-chat-overlay';
import { ReplyBox } from '@/components/chat/reply-box';
import { Loader } from '@/components/ui/loader';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { useSocketListener } from '@/hooks/use-socket-listener';

import { cn } from '@/utils';

export default function CommunityChat() {
    const {
        fetchConversationBySlug,
        conversation,
        fetchMembers,
        isLoading: isConvLoading,
    } = useCommunityConversationStore();
    const { replyingTo, closeReplyBox } = useReply();
    const { show } = useToastStore();
    const { isSearchOpen, isSearching } = useChatPanelStore();
    const {
        messages,
        addMessage,
        fetchMessages,
        fetchMoreMessages,
        fetchNewerMessages,
        sendMessage,
        markAsRead,
        updateReadStatus,
        isLoading: isMessagesLoading,
        isFetchingMore,
        isFetchingNewer,
        isFetchingContext,
        isWaitContextMessageScrolling,
        hasMoreBefore,
        hasMoreAfter,
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastScrollHeightRef = useRef<number>(0);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior,
                block: 'end',
            });
        } else if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior,
            });
        }
    };

    const handleScroll = () => {
        if (
            !scrollRef.current ||
            isFetchingMore ||
            isFetchingNewer ||
            isFetchingContext ||
            isWaitContextMessageScrolling ||
            !conversation?.id
        )
            return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        // Fetch older messages (scroll to top)
        if (scrollTop === 0 && hasMoreBefore) {
            lastScrollHeightRef.current = scrollHeight;
            console.log('fetch before');
            fetchMoreMessages(conversation.id);
        }
        // Fetch newer messages (scroll to bottom)
        else if (scrollTop + clientHeight >= scrollHeight - 10 && hasMoreAfter) {
            console.log('fetch after');
            fetchNewerMessages(conversation.id);
        }
    };

    // Maintain scroll position when older messages are prepended
    useEffect(() => {
        if (!isFetchingMore && lastScrollHeightRef.current > 0 && scrollRef.current) {
            const newScrollHeight = scrollRef.current.scrollHeight;
            scrollRef.current.scrollTop = newScrollHeight - lastScrollHeightRef.current;
            lastScrollHeightRef.current = 0;
        }
    }, [isFetchingMore]);

    useSocketListener<RawMessage>('chat:new_message', (data) => {
        if (data.conversation_id.toString() !== conversation?.id.toString()) return;

        // If we are in historical mode (hasMoreAfter), don't add new messages to the list
        // as they would be added at the end of the current (old) context.
        if (hasMoreAfter) return;

        // Don't add if it's our own message (we added it optimistically or via response)
        if (useCurrentMessages.getState().messages.some((m) => m.id.toString() === data.id.toString())) return;

        const newMessage = mapRawMessageToMessage(data, currentUser?.id);
        addMessage(newMessage);

        // Scroll to bottom when a new message arrives
        setTimeout(() => scrollToBottom('smooth'), 100);
    });

    useSocketListener<RawMessage>('chat:mention', (data) => {
        // This is received when the current user is mentioned
        show({
            title: 'New Mention',
            message: `${data.sender?.name} mentioned you: "${data.content.slice(0, 50)}${data.content.length > 50 ? '...' : ''}"`,
            type: 'info',
        });
    });

    useSocketListener<{
        message_id: string;
        conversation_id: string;
        user_id: string | number;
        reaction: string;
        user?: BasicUserInfo;
    }>('chat:reaction_added', (data) => {
        // Ignore if it's our own reaction (already handled optimistically)
        if (data.user_id.toString() === currentUser?.id.toString()) return;

        const { addReactionToState } = useMessageReactionStore.getState();

        // Try to find user info from existing messages or the event itself
        const userInfo: BasicUserInfo = data.user ||
            messages.find((m) => m.sender.id.toString() === data.user_id.toString())?.sender || {
                id: data.user_id,
                name: 'Unknown',
                username: '',
                picture: null,
            };

        addReactionToState(data.message_id, data.reaction, userInfo);
    });

    useSocketListener<{ message_id: string; conversation_id: string; user_id: string | number; reaction: string }>(
        'chat:reaction_removed',
        (data) => {
            // Ignore if it's our own reaction (already handled optimistically)
            if (data.user_id.toString() === currentUser?.id.toString()) return;

            const { removeReactionFromState } = useMessageReactionStore.getState();
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
            fetchMessages(conversation.id).then(() => {
                // Scroll to bottom on initial load
                setTimeout(() => scrollToBottom('auto'), 100);
            });
            fetchMembers(conversation.id); // Fetch members immediately for mentions
        }
    }, [conversation?.id, fetchMessages, fetchMembers]);

    useEffect(() => {
        if (replyingTo && chatInputRef.current) {
            chatInputRef.current.focusEditor();
        }
    }, [replyingTo]);

    const handleSendMessage = async (text: string, files: File[], mentions?: (string | number)[]) => {
        if (!conversation?.id) return;

        try {
            await sendMessage(conversation.id, text, files, replyingTo?.id, mentions);
            closeReplyBox();
            // Scroll to bottom immediately after sending for better UX
            setTimeout(() => scrollToBottom('smooth'), 50);
        } catch (error) {
            console.error('Error in handleSendMessage:', error);
        }
    };

    if (isConvLoading || (isMessagesLoading && messages.length === 0)) {
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
                {isSearchOpen && <ChatSearchBar conversationId={conversation.id} />}
                <ScrollableView ref={scrollRef} className="flex-1 px-4" vertical onScroll={handleScroll}>
                    <div className="flex flex-col gap-2 py-4 pb-10  w-full min-h-full">
                        {(isFetchingContext || isSearching) && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                                <Loader size={32} />
                            </div>
                        )}
                        {isFetchingMore && <Loader size={16} className="py-2" />}
                        {messages.map((msg) => (
                            <div key={msg.id} id={`message-item-${msg.id}`}>
                                <ChatMessage
                                    id={msg.id}
                                    text={msg.text}
                                    role={msg.role}
                                    time={msg.time || ''}
                                    name={msg.sender.name}
                                    avatar={
                                        (msg.role === MESSAGE_ROLE.ME ? currentUser?.picture : msg.sender.picture) || ''
                                    }
                                    readBy={msg.readBy}
                                    type={msg.type}
                                    metadata={msg.metadata}
                                    content={msg.content}
                                    reply_to_message={msg.reply_to_message}
                                    attachments={msg.attachments}
                                    mentions={msg.mentions}
                                    is_deleted={msg.is_deleted}
                                />
                            </div>
                        ))}
                        {isFetchingNewer && <Loader size={16} className="py-2" />}
                        <div ref={messagesEndRef} className="h-px w-full" />
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
