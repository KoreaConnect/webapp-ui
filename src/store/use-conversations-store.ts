import type { Conversation, User } from '@/types/chat.type';
import { create } from 'zustand';

import { conversationService } from '@/services';

type RawConversation = {
    id: string | number;
    name: string;
    type: string;
    slug: string;
    is_public: boolean;
    post_id: string | null;
    created_at: string;
    created_by: string | null;
    last_message_id: string | null;
    last_message_at: string | null;
    thumbnail_url: string | null;
    is_joined: boolean;
    members_count?: number;
    participants?: User[];
    members?: User[];
    online_count?: number;
    unread_count?: number;
    last_message?: {
        content: string;
        sender_name: string;
        sender_id: string | number;
        type: string;
    } | null;
};

type ConversationsState = {
    conversations: Conversation[];
    isLoading: boolean;
    fetchConversations: (limit?: number, offset?: number) => Promise<void>;
    addConversation: (conversation: Conversation) => void;
    updateConversation: (id: string, updates: Partial<Conversation>) => void;
    deleteConversation: (id: string) => void;
};

export const useConversationsStore = create<ConversationsState>((set, get) => ({
    conversations: [],
    isLoading: false,
    fetchConversations: async (limit = 20, offset = 0) => {
        set({ isLoading: true });
        try {
            const response = await conversationService.getMyConversations(limit, offset);
            const rawConversations: RawConversation[] = response.data;

            const mappedConversations: Conversation[] = rawConversations.map((data) => ({
                id: data.id.toString(),
                title: data.name,
                type: data.type,
                slug: data.slug,
                is_public: data.is_public,
                post_id: data.post_id,
                createdAt: data.created_at,
                created_at: data.created_at,
                createdBy: data.created_by || 'System',
                created_by: data.created_by,
                last_message_id: data.last_message_id,
                last_message_at: data.last_message_at,
                thumbnail_url: data.thumbnail_url || '/images/default-avatar.png',
                is_joined: data.is_joined,
                members_count: data.members_count,
                participants: data.participants || data.members || [],
                onlineCount: data.online_count || 0,
                unread_count: data.unread_count || 0,
                last_message: data.last_message,
            }));

            set({
                conversations: offset === 0 ? mappedConversations : [...get().conversations, ...mappedConversations],
                isLoading: false,
            });
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            set({ isLoading: false });
        }
    },
    addConversation: (conversation) => {
        set((state) => ({
            conversations: [conversation, ...state.conversations],
        }));
    },
    updateConversation: (id, updates) => {
        set((state) => ({
            conversations: state.conversations.map((conv) => (conv.id === id ? { ...conv, ...updates } : conv)),
        }));
    },
    deleteConversation: (id) => {
        set((state) => ({
            conversations: state.conversations.filter((conv) => conv.id !== id),
        }));
    },
}));
