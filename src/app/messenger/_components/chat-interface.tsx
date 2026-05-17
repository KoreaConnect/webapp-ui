'use client';

import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/store/use-auth-store';
import { useChatPanelStore } from '@/store/use-chat-panel-store';
import { useCurrentConversationStore } from '@/store/use-current-conversation-store';
import { mapRawMessageToMessage, useCurrentMessages } from '@/store/use-current-messages';
import { useMessageReactionStore } from '@/store/use-message-reaction-store';
import { useReplyStore } from '@/store/use-reply-store';
import { BasicUserInfo, MESSAGE_ROLE, type RawMessage } from '@/types/chat.type';
import { useRouter } from 'next/navigation';

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

interface ChatInterfaceProps {
    conversationId?: string;
    conversationSlug?: string;
}

export default function ChatInterface({ conversationId, conversationSlug }: ChatInterfaceProps) {
    const router = useRouter();
    const {
        fetchConversationById,
        fetchConversationBySlug,
        conversation,
        fetchMembers,
        updateMemberStatus,
        setOnlineCount,
        isLoading: isConversationLoading,
    } = useCurrentConversationStore();

    const { replyingTo, closeReplyBox } = useReplyStore();
    const { isSearchOpen, isSearching } = useChatPanelStore();

    const {
        messages,
        addMessage,
        fetchMessages,
        fetchMoreMessages,
        fetchNewerMessages,
        sendMessage,
        markAsRead,
        isLoading: isMessagesLoading,
        isFetchingMore,
        isFetchingNewer,
        isFetchingContext,
        isWaitContextMessageScrolling,
        hasMoreBefore,
        hasMoreAfter,
        clearMessages,
    } = useCurrentMessages();

    const lastReadMessageIdRef = useRef<string | null>(null);
    const currentUser = useAuthStore((state) => state.user);
    const chatInputRef = useRef<{ focusEditor: () => void }>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastScrollHeightRef = useRef<number>(0);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
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

        const { scrollTop, scrollHeight } = scrollRef.current;
        if (scrollTop === 0 && hasMoreBefore) {
            lastScrollHeightRef.current = scrollHeight;
            fetchMoreMessages(conversation.id);
        } else if (scrollTop + scrollRef.current.clientHeight >= scrollHeight - 10 && hasMoreAfter) {
            fetchNewerMessages(conversation.id);
        }
    };

    useEffect(() => {
        if (!isFetchingMore && lastScrollHeightRef.current > 0 && scrollRef.current) {
            const newScrollHeight = scrollRef.current.scrollHeight;
            scrollRef.current.scrollTop = newScrollHeight - lastScrollHeightRef.current;
            lastScrollHeightRef.current = 0;
        }
    }, [isFetchingMore]);

    // Socket listeners
    useSocketListener<{ user_id: string | number }>('user:online', (data) => {
        updateMemberStatus(data.user_id, true);
    });

    useSocketListener<{ user_id: string | number }>('user:offline', (data) => {
        updateMemberStatus(data.user_id, false);
    });

    useSocketListener<{ conversation_id: string | number; online_count: number }>(
        'conversation:online_count_update',
        (data) => {
            if (data.conversation_id.toString() !== conversation?.id.toString()) return;
            setOnlineCount(data.online_count);
        },
    );

    useSocketListener<RawMessage>('chat:new_message', (data) => {
        if (data.conversation_id.toString() !== conversation?.id.toString()) return;
        if (hasMoreAfter) return;
        if (useCurrentMessages.getState().messages.some((m) => m.id.toString() === data.id.toString())) return;

        const newMessage = mapRawMessageToMessage(data, currentUser?.id);
        addMessage(newMessage);
        setTimeout(() => scrollToBottom('smooth'), 100);
    });

    useSocketListener<{
        message_id: string;
        conversation_id: string;
        user_id: string | number;
        reaction: string;
        user?: BasicUserInfo;
    }>('chat:reaction_added', (data) => {
        if (data.conversation_id.toString() !== conversation?.id.toString()) return;
        if (data.user_id.toString() === currentUser?.id.toString()) return;

        const { addReactionToState } = useMessageReactionStore.getState();
        const userInfo: BasicUserInfo = data.user ||
            messages.find((m) => m.sender.id.toString() === data.user_id.toString())?.sender || {
                id: data.user_id,
                name: 'Unknown',
                username: '',
                picture: null,
            };

        addReactionToState(data.message_id, data.reaction, userInfo);
    });

    useEffect(() => {
        if (replyingTo && chatInputRef.current) {
            chatInputRef.current.focusEditor();
        }
    }, [replyingTo]);

    // Mark as read logic
    useEffect(() => {
        if (!conversation?.id || !conversation.is_joined || messages.length === 0 || isMessagesLoading) return;
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.id !== lastReadMessageIdRef.current) {
            lastReadMessageIdRef.current = lastMessage.id;
            markAsRead(conversation.id, lastMessage.id);
        }
    }, [conversation?.id, conversation?.is_joined, messages, isMessagesLoading, markAsRead]);

    // Fetch conversation
    useEffect(() => {
        if (conversationId || conversationSlug) {
            clearMessages();
            closeReplyBox();
            if (conversationSlug) {
                fetchConversationBySlug(conversationSlug);
            } else if (conversationId) {
                fetchConversationById(conversationId);
            }
        }
    }, [
        conversationId,
        conversationSlug,
        fetchConversationById,
        fetchConversationBySlug,
        clearMessages,
        closeReplyBox,
    ]);

    // Fetch messages and members once conversation is loaded
    useEffect(() => {
        if (conversation?.id) {
            fetchMessages(conversation.id).then(() => {
                setTimeout(() => scrollToBottom('auto'), 100);
            });
            fetchMembers(conversation.id);
        }
    }, [conversation?.id, fetchMessages, fetchMembers]);

    const handleSendMessage = async (text: string, files: File[], mentions?: (string | number)[]) => {
        if (!conversation?.id) return;
        try {
            await sendMessage(conversation.id, text, files, replyingTo?.id, mentions);
            console.log('Message sent successfully');
            closeReplyBox();
            setTimeout(() => scrollToBottom('smooth'), 50);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (isConversationLoading || (isMessagesLoading && messages.length === 0)) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader size={32} />
            </div>
        );
    }

    if (!conversation) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Conversation not found.</p>
            </div>
        );
    }

    return (
        <div className={cn('relative flex h-full bg-background overflow-hidden border-r border-border')}>
            <div className="flex flex-1 flex-col min-w-0">
                <ChatHeader
                    title={conversation.title}
                    thumbnailUrl={conversation.thumbnail_url}
                    onlineUserCount={conversation.onlineCount || 0}
                />
                {isSearchOpen && <ChatSearchBar conversationId={conversation.id} />}
                <ScrollableView ref={scrollRef} className="flex-1 px-4" vertical onScroll={handleScroll}>
                    <div className="flex flex-col gap-2 py-4 pb-10 w-full min-h-full">
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
