import type { Conversation, RawConversationMember, User } from '@/types/chat.type';
import { create } from 'zustand';

import { conversationService } from '@/services';

type CommunityConversationState = {
    hasJoined: boolean;
    isJoining: boolean;
    isLoading: boolean;
    isMembersLoading: boolean;
    joinChat: (conversationId: string) => Promise<void>;
    conversation: Conversation | null;
    members: User[];
    setConversation: (conversation: Conversation | null) => void;
    updateConversation: (id: string, updates: Partial<Conversation>) => void;
    fetchConversationBySlug: (slug: string) => Promise<void>;
    fetchMembers: (conversationId: string) => Promise<void>;
};

export const useCommunityConversationStore = create<CommunityConversationState>((set) => ({
    conversation: null,
    members: [],
    isLoading: false,
    isMembersLoading: false,
    hasJoined: false, // Initial state: user has not joined
    isJoining: false,
    joinChat: async (conversationId: string) => {
        set({ isJoining: true });
        try {
            await conversationService.joinConversation(conversationId);
            set({ hasJoined: true, isJoining: false });
        } catch (error) {
            console.error('Failed to join conversation:', error);
            set({ isJoining: false });
        }
    },
    setConversation: (conversation) => set({ conversation }),
    updateConversation: (id, updates) =>
        set((state) => ({
            conversation: state.conversation?.id === id ? { ...state.conversation, ...updates } : state.conversation,
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
                participants: data.participants || data.members || [],
                onlineCount: data.online_count || 0,
            };

            set({ conversation: conversation, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch conversation:', error);
            set({ isLoading: false });
        }
    },
    fetchMembers: async (conversationId: string) => {
        set({ isMembersLoading: true });
        try {
            const response = await conversationService.getMembers(conversationId);
            const data = response.data as RawConversationMember[];
            const mappedMembers: User[] = data.map((member) => ({
                id: member.user_id,
                name: member.name,
                username: member.username,
                avatar: member.picture || undefined,
                isOnline: member.is_online || false,
            }));
            set({ members: mappedMembers, isMembersLoading: false });
        } catch (error) {
            console.error('Failed to fetch members:', error);
            set({ isMembersLoading: false });
        }
    },
}));
