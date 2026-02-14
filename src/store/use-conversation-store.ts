import type { Conversation } from '@/types/chat.type';
import { create } from 'zustand';

import { conversationService } from '@/services';

type ConversationState = {
    activeConversation: Conversation | null;
    conversations: Conversation[];
    isLoading: boolean;
    setActiveConversation: (conversation: Conversation | null) => void;
    setConversations: (conversations: Conversation[]) => void;
    updateConversation: (id: string, updates: Partial<Conversation>) => void;
    fetchConversationBySlug: (slug: string) => Promise<void>;
};

export const useConversationStore = create<ConversationState>((set) => ({
    activeConversation: null,
    conversations: [],
    isLoading: false,
    setActiveConversation: (conversation) => set({ activeConversation: conversation }),
    setConversations: (conversations) => set({ conversations }),
    updateConversation: (id, updates) =>
        set((state) => ({
            conversations: state.conversations.map((c) => (c.id === id ? { ...c, ...updates } : c)),
            activeConversation:
                state.activeConversation?.id === id
                    ? { ...state.activeConversation, ...updates }
                    : state.activeConversation,
        })),
    fetchConversationBySlug: async (slug) => {
        set({ isLoading: true });
        try {
            const response = await conversationService.getConversationBySlug(slug);
            const data = response.data;

            const conversation: Conversation = {
                id: data.id,
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
                thumbnail_url: data.thumbnail_url || '/images/community-avatar.png', // Default
                is_joined: data.is_joined,
                members_count: data.members_count,
                participants: [],
                onlineCount: 0,
            };

            set({ activeConversation: conversation, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch conversation:', error);
            set({ isLoading: false });
        }
    },
}));
