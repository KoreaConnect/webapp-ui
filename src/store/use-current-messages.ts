import { useAuthStore } from '@/store/use-auth-store';
import { useChatStore } from '@/store/use-chat-store';
import type { BasicUserInfo, Message, RawMessage } from '@/types/chat.type';
import { create } from 'zustand';

import { conversationService } from '@/services';

const LIMIT_MESSAGES = 50;

const mapReactions = (reactions?: RawMessage['reactions']): Record<string, string[]> => {
    const map: Record<string, string[]> = {};
    if (!reactions) return map;

    reactions.forEach((r) => {
        const type = r.reaction;
        if (!map[type]) {
            map[type] = [];
        }
        map[type].push(r.user.id.toString());
    });
    return map;
};

export const mapRawMessageToMessage = (msg: RawMessage, currentUserId?: string | number): Message => {
    const effectiveSenderId = msg.sender_id || msg.sender?.id;
    const isSystem = msg.type === 'system' || effectiveSenderId?.toString() === '0';
    let role: Message['role'] = 'other';

    if (isSystem) {
        role = 'system';
    } else if (effectiveSenderId?.toString() === currentUserId?.toString()) {
        role = 'me';
    }

    const mappedReactions = mapReactions(msg.reactions);

    const sender: BasicUserInfo = {
        id: msg.sender?.id || effectiveSenderId || '0',
        name: msg.sender?.name || 'Unknown',
        username: msg.sender?.username || '',
        picture: msg.sender?.picture || null,
    };

    return {
        id: msg.id?.toString() || Math.random().toString(36).substring(7),
        text: msg.content || '',
        content: msg.content,
        role,
        sender,
        type: msg.type as 'text' | 'system',
        metadata: msg.metadata,
        time: msg.created_at
            ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
        created_at: msg.created_at,
        reactions: mappedReactions,
        readBy: msg.read_by?.map((r) => ({
            user: r.user,
            readAt: r.read_at ? new Date(r.read_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        })),
        reply_to_message_id: msg.reply_to_message_id?.toString() || null,
        reply_to_message: msg.reply_to_message ? mapRawMessageToMessage(msg.reply_to_message, currentUserId) : null,
        attachments: msg.attachments,
    };
};

type CurrentMessagesState = {
    messages: Message[];
    isLoading: boolean;
    isFetchingMore: boolean;
    hasMore: boolean;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateMessage: (id: string, updates: Partial<Message>) => void;
    removeMessage: (id: string) => void;
    clearMessages: () => void;
    fetchMessages: (conversationId: string) => Promise<void>;
    fetchMoreMessages: (conversationId: string) => Promise<void>;
    sendMessage: (
        conversationId: string,
        content: string,
        files: File[],
        replyToMessageId?: string | null,
    ) => Promise<void>;
    markAsRead: (conversationId: string, lastMessageId: string | number) => Promise<void>;
    updateReadStatus: (userId: string, lastReadMessageId: string, lastReadMessageAt: string) => void;
};

export const useCurrentMessages = create<CurrentMessagesState>((set, get) => ({
    messages: [],
    isLoading: false,
    isFetchingMore: false,
    hasMore: true,
    setMessages: (messages) => set({ messages }),
    updateReadStatus: (userId, lastReadMessageId, lastReadMessageAt) => {
        set((state) => {
            // 1. Find user info first from existing state
            let userInfo: BasicUserInfo | null = null;
            for (const m of state.messages) {
                const found = m.readBy?.find((r) => r.user.id.toString() === userId.toString());
                if (found) {
                    userInfo = found.user;
                    break;
                }
                if (m.metadata?.target_user?.id.toString() === userId.toString()) {
                    userInfo = {
                        id: Number(m.metadata.target_user.id),
                        name: m.metadata.target_user.name,
                        username: m.metadata.target_user.username || '',
                        picture: m.metadata.target_user.picture || null,
                    };
                    break;
                }
            }

            if (!userInfo) return state;

            // 2. Update all messages
            return {
                messages: state.messages.map((msg) => {
                    const currentReadBy = msg.readBy || [];
                    const isTargetMessage = msg.id.toString() === lastReadMessageId.toString();

                    // Remove from all messages (user can only have one "last read" position)
                    const filteredReadBy = currentReadBy.filter((r) => r.user.id.toString() !== userId.toString());

                    if (isTargetMessage) {
                        return {
                            ...msg,
                            readBy: [
                                ...filteredReadBy,
                                {
                                    user: userInfo!,
                                    readAt: new Date(lastReadMessageAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }),
                                },
                            ],
                        };
                    }

                    return { ...msg, readBy: filteredReadBy };
                }),
            };
        });
    },
    addMessage: (message) => {
        const { id, reactions, readBy } = message;
        if (reactions) {
            useChatStore.getState().setMessageReactions({ [id]: reactions });
        }
        set((state) => {
            // 1. If the message already exists, don't add it again
            if (state.messages.some((m) => m.id.toString() === message.id.toString())) {
                return state;
            }

            // 2. If the new message has read receipts, remove those users from any older messages
            let updatedMessages = [...state.messages];
            if (readBy && readBy.length > 0) {
                const userIdsInNewReceipts = new Set(readBy.map((r) => r.user.id.toString()));
                updatedMessages = updatedMessages.map((m) => ({
                    ...m,
                    readBy: m.readBy?.filter((r) => !userIdsInNewReceipts.has(r.user.id.toString())),
                }));
            }

            return { messages: [...updatedMessages, message] };
        });
    },
    updateMessage: (id, updates) =>
        set((state) => ({
            messages: state.messages.map((m) => (m.id.toString() === id.toString() ? { ...m, ...updates } : m)),
        })),
    removeMessage: (id) =>
        set((state) => ({
            messages: state.messages.filter((m) => m.id.toString() !== id.toString()),
        })),
    clearMessages: () => set({ messages: [], hasMore: true }),
    markAsRead: async (conversationId, lastMessageId) => {
        try {
            await conversationService.markAsRead(conversationId, lastMessageId);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    },
    sendMessage: async (conversationId, content, files, replyToMessageId) => {
        try {
            const response = await conversationService.sendMessage(conversationId, content, files, replyToMessageId);
            const msg: RawMessage = response.data;
            const currentUser = useAuthStore.getState().user;

            const newMessage = mapRawMessageToMessage(msg, currentUser?.id);
            // Overwrite role to 'me' if needed, though mapRawMessageToMessage should handle it
            newMessage.role = 'me';
            if (currentUser) {
                newMessage.sender = {
                    id: currentUser.id,
                    name: currentUser.name,
                    username: '',
                    picture: currentUser.picture || null,
                };
            }

            get().addMessage(newMessage);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    },
    fetchMessages: async (conversationId) => {
        set({ isLoading: true, hasMore: true });
        try {
            const response = await conversationService.getMessages(conversationId, LIMIT_MESSAGES);
            const currentUserId = useAuthStore.getState().user?.id;

            const reactionsMap: Record<string, Record<string, string[]>> = {};

            const mappedMessages: Message[] = response.data.map((msg: RawMessage) => {
                const message = mapRawMessageToMessage(msg, currentUserId);
                reactionsMap[message.id] = message.reactions || {};
                return message;
            });

            useChatStore.getState().setMessageReactions(reactionsMap);
            set({ messages: mappedMessages, isLoading: false, hasMore: mappedMessages.length >= LIMIT_MESSAGES });
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            set({ isLoading: false });
        }
    },
    fetchMoreMessages: async (conversationId) => {
        const { messages, isFetchingMore, hasMore } = get();
        if (isFetchingMore || !hasMore || messages.length === 0) return;

        set({ isFetchingMore: true });
        try {
            const oldestMessage = messages[0];
            const response = await conversationService.getMessages(
                conversationId,
                LIMIT_MESSAGES,
                oldestMessage.created_at,
            );
            const currentUserId = useAuthStore.getState().user?.id;

            const reactionsMap: Record<string, Record<string, string[]>> = {};

            const mappedMessages: Message[] = response.data.map((msg: RawMessage) => {
                const message = mapRawMessageToMessage(msg, currentUserId);
                reactionsMap[message.id] = message.reactions || {};
                return message;
            });

            useChatStore.getState().setMessageReactions(reactionsMap);

            if (mappedMessages.length === 0) {
                set({ hasMore: false, isFetchingMore: false });
            } else {
                set((state) => ({
                    messages: [...mappedMessages, ...state.messages],
                    isFetchingMore: false,
                    hasMore: mappedMessages.length >= LIMIT_MESSAGES,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch more messages:', error);
            set({ isFetchingMore: false });
        }
    },
}));
