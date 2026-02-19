import { useAuthStore } from '@/store/use-auth-store';
import { useChatStore } from '@/store/use-chat-store';
import type { Message, RawMessage } from '@/types/chat.type';
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
    sendMessage: (conversationId: string, content: string, replyToMessageId?: string | null) => Promise<void>;
    markAsRead: (conversationId: string, lastMessageId: string | number) => Promise<void>;
};

export const useCurrentMessages = create<CurrentMessagesState>((set, get) => ({
    messages: [],
    isLoading: false,
    isFetchingMore: false,
    hasMore: true,
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => {
        const { id, reactions } = message;
        if (reactions) {
            useChatStore.getState().setMessageReactions({ [id]: reactions });
        }
        set((state) => {
            if (state.messages.some((m) => m.id.toString() === message.id.toString())) {
                return state;
            }
            return { messages: [...state.messages, message] };
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
    sendMessage: async (conversationId, content, replyToMessageId) => {
        try {
            const response = await conversationService.sendMessage(conversationId, content, replyToMessageId);
            const msg: RawMessage = response.data;
            // const currentUserId = useAuthStore.getState().user?.id;

            const currentUser = useAuthStore.getState().user;
            const newMessage: Message = {
                id: msg.id.toString(),
                text: msg.content || '',
                content: msg.content,
                sender: 'me', // It's always 'me' when sending
                type: msg.type as 'text' | 'system',
                metadata: msg.metadata,
                time: msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                created_at: msg.created_at,
                name: 'Me',
                avatar: currentUser?.picture,
                reactions: mapReactions(msg.reactions),
                readBy: currentUser
                    ? [
                          {
                              user: {
                                  id: Number(currentUser.id),
                                  name: currentUser.name,
                                  username: '', // Not needed for receipt
                                  picture: currentUser.picture || null,
                              },
                              readAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          },
                      ]
                    : [],
            };

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
                const isSystem = msg.type === 'system' || msg.sender_id.toString() === '0';
                let sender: Message['sender'] = 'other';

                if (isSystem) {
                    sender = 'system';
                } else if (msg.sender_id.toString() === currentUserId?.toString()) {
                    sender = 'me';
                }

                const mappedReactions = mapReactions(msg.reactions);
                reactionsMap[msg.id.toString()] = mappedReactions;

                return {
                    id: msg.id.toString(),
                    text: msg.content || '',
                    content: msg.content,
                    sender,
                    type: msg.type as 'text' | 'system',
                    metadata: msg.metadata,
                    time: msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '',
                    created_at: msg.created_at,
                    name: msg.sender?.name || (sender === 'me' ? 'Me' : 'Other'),
                    avatar: msg.sender?.picture || msg.sender?.avatar || msg.metadata?.user?.picture,
                    reactions: mappedReactions,
                    readBy: msg.read_by?.map((r) => ({
                        user: r.user,
                        readAt: new Date(r.read_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    })),
                };
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
                const isSystem = msg.type === 'system' || msg.sender_id.toString() === '0';
                let sender: Message['sender'] = 'other';

                if (isSystem) {
                    sender = 'system';
                } else if (msg.sender_id.toString() === currentUserId?.toString()) {
                    sender = 'me';
                }

                const mappedReactions = mapReactions(msg.reactions);
                reactionsMap[msg.id.toString()] = mappedReactions;

                return {
                    id: msg.id.toString(),
                    text: msg.content || '',
                    content: msg.content,
                    sender,
                    type: msg.type as 'text' | 'system',
                    metadata: msg.metadata,
                    time: msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '',
                    created_at: msg.created_at,
                    name: msg.sender?.name || (sender === 'me' ? 'Me' : 'Other'),
                    avatar: msg.sender?.picture || msg.sender?.avatar,
                    reactions: mappedReactions,
                    readBy: msg.read_by?.map((r) => ({
                        user: r.user,
                        readAt: new Date(r.read_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    })),
                };
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
