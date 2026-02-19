import { useAuthStore } from '@/store/use-auth-store';
import type { Message } from '@/types/chat.type';
import { create } from 'zustand';

import { conversationService } from '@/services';

type CurrentMessagesState = {
    messages: Message[];
    isLoading: boolean;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateMessage: (id: string, updates: Partial<Message>) => void;
    removeMessage: (id: string) => void;
    clearMessages: () => void;
    fetchMessages: (conversationId: string) => Promise<void>;
    sendMessage: (conversationId: string, content: string, replyToMessageId?: string | null) => Promise<void>;
};

export const useCurrentMessages = create<CurrentMessagesState>((set, get) => ({
    messages: [],
    isLoading: false,
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
        set((state) => {
            if (state.messages.some((m) => m.id.toString() === message.id.toString())) {
                return state;
            }
            return { messages: [...state.messages, message] };
        }),
    updateMessage: (id, updates) =>
        set((state) => ({
            messages: state.messages.map((m) => (m.id.toString() === id.toString() ? { ...m, ...updates } : m)),
        })),
    removeMessage: (id) =>
        set((state) => ({
            messages: state.messages.filter((m) => m.id.toString() !== id.toString()),
        })),
    clearMessages: () => set({ messages: [] }),
    sendMessage: async (conversationId, content, replyToMessageId) => {
        console.log('Sending message:', content);
        try {
            const response = await conversationService.sendMessage(conversationId, content, replyToMessageId);
            const msg = response.data;
            // const currentUserId = useAuthStore.getState().user?.id;

            const newMessage: Message = {
                id: msg.id.toString(),
                text: msg.content || '',
                content: msg.content,
                sender: 'me', // It's always 'me' when sending
                type: msg.type,
                metadata: msg.metadata,
                time: msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                created_at: msg.created_at,
                name: 'Me',
                avatar: useAuthStore.getState().user?.picture,
            };

            get().addMessage(newMessage);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    },
    fetchMessages: async (conversationId) => {
        set({ isLoading: true });
        try {
            const response = await conversationService.getMessages(conversationId);
            const currentUserId = useAuthStore.getState().user?.id;

            const mappedMessages: Message[] = response.data.map((msg) => {
                const isSystem = msg.type === 'system' || msg.sender_id === 0;
                let sender: Message['sender'] = 'other';

                if (isSystem) {
                    sender = 'system';
                } else if (msg.sender_id.toString() === currentUserId?.toString()) {
                    sender = 'me';
                }

                return {
                    id: msg.id.toString(),
                    text: msg.content || '',
                    content: msg.content,
                    sender,
                    type: msg.type,
                    metadata: msg.metadata,
                    time: msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '',
                    created_at: msg.created_at,
                    name: msg.sender?.name || (sender === 'me' ? 'Me' : 'Other'),
                    avatar: msg.sender?.picture || msg.sender?.avatar,
                };
            });

            set({ messages: mappedMessages, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            set({ isLoading: false });
        }
    },
}));
