import type { Attachment, Conversation, User } from '@/types/chat.type';
import { create } from 'zustand';

import { conversationService } from '@/services';

type ActiveConversationState = {
    conversation: Conversation | null;
    isLoading: boolean;
    members: User[];
    isMembersLoading: boolean;
    media: Attachment[];
    isMediaLoading: boolean;
    files: Attachment[];
    isFilesLoading: boolean;
    hasMoreMembers: boolean;
    hasMoreMedia: boolean;
    hasMoreFiles: boolean;

    setConversation: (conversation: Conversation | null) => void;
    fetchConversationById: (id: string) => Promise<void>;
    fetchMembers: (conversationId: string, loadMore?: boolean) => Promise<void>;
    fetchAttachments: (
        conversationId: string,
        type: 'image' | 'file' | 'video' | 'audio',
        loadMore?: boolean,
    ) => Promise<void>;
    joinChat: (conversationId: string) => Promise<void>;
    leaveGroup: (conversationId: string) => Promise<void>;
};

export const useActiveConversationStore = create<ActiveConversationState>((set, get) => ({
    conversation: null,
    isLoading: false,
    members: [],
    isMembersLoading: false,
    media: [],
    isMediaLoading: false,
    files: [],
    isFilesLoading: false,
    hasMoreMembers: false,
    hasMoreMedia: false,
    hasMoreFiles: false,

    setConversation: (conversation) => set({ conversation }),

    fetchConversationById: async (id) => {
        set({ isLoading: true });
        try {
            const response = await conversationService.getConversationById(id);
            const data = response.data;

            const conversation: Conversation = {
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
            };

            set({ conversation, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch conversation:', error);
            set({ isLoading: false });
        }
    },

    joinChat: async (conversationId: string) => {
        try {
            await conversationService.joinConversation(conversationId);
            const current = get().conversation;
            if (current && current.id === conversationId) {
                set({ conversation: { ...current, is_joined: true } });
            }
        } catch (error) {
            console.error('Failed to join:', error);
        }
    },

    leaveGroup: async (conversationId: string) => {
        try {
            await conversationService.leaveConversation(conversationId);
            const current = get().conversation;
            if (current && current.id === conversationId) {
                set({ conversation: { ...current, is_joined: false } });
            }
        } catch (error) {
            console.error('Failed to leave:', error);
        }
    },

    fetchMembers: async (conversationId, loadMore = false) => {
        set({ isMembersLoading: true });
        try {
            const currentMembers = get().members;
            const lastMember = loadMore && currentMembers.length > 0 ? currentMembers[currentMembers.length - 1] : null;

            const response = await conversationService.getMembers(conversationId, {
                limit: 20,
                before: lastMember?.joined_at,
                beforeId: lastMember?.id,
            });

            const { members: rawMembers, hasMore } = response.data;
            const mappedMembers: User[] = rawMembers.map((member) => ({
                id: member.user_id,
                name: member.name,
                username: member.username,
                avatar: member.picture || undefined,
                isOnline: member.is_online || false,
                joined_at: member.joined_at,
            }));

            set({
                members: loadMore ? [...currentMembers, ...mappedMembers] : mappedMembers,
                isMembersLoading: false,
                hasMoreMembers: hasMore,
            });
        } catch (error) {
            console.error('Failed to fetch members:', error);
            set({ isMembersLoading: false });
        }
    },

    fetchAttachments: async (conversationId, type, loadMore = false) => {
        const isMedia = type === 'image' || type === 'video';
        const loadingKey = isMedia ? 'isMediaLoading' : 'isFilesLoading';
        const dataKey = isMedia ? 'media' : 'files';
        const hasMoreKey = isMedia ? 'hasMoreMedia' : 'hasMoreFiles';

        set((state) => ({ ...state, [loadingKey]: true }));

        try {
            const currentItems = get()[dataKey];
            const lastItem = loadMore && currentItems.length > 0 ? currentItems[currentItems.length - 1] : null;

            const response = await conversationService.getAttachments(conversationId, {
                type,
                limit: 20,
                before: lastItem?.created_at,
                beforeId: lastItem?.id,
            });

            const { attachments, hasMore } = response.data;

            set((state) => ({
                ...state,
                [dataKey]: loadMore ? [...currentItems, ...attachments] : attachments,
                [hasMoreKey]: hasMore,
                [loadingKey]: false,
            }));
        } catch (error) {
            console.error(`Failed to fetch ${type}:`, error);
            set((state) => ({ ...state, [loadingKey]: false }));
        }
    },
}));
