import type { Attachment, Conversation, User } from '@/types/chat.type';
import { create } from 'zustand';

import { conversationService } from '@/services';

type CurrentConversationState = {
    hasJoined: boolean;
    isJoining: boolean;
    isLeaving: boolean;
    isLoading: boolean;
    isMembersLoading: boolean;
    isMediaLoading: boolean;
    isFilesLoading: boolean;
    joinChat: (conversationId: string) => Promise<void>;
    leaveGroup: (conversationId: string) => Promise<void>;
    conversation: Conversation | null;
    members: User[];
    media: Attachment[];
    files: Attachment[];
    hasMoreMedia: boolean;
    hasMoreFiles: boolean;
    hasMoreMembers: boolean;
    setConversation: (conversation: Conversation | null) => void;
    updateConversation: (id: string, updates: Partial<Conversation>) => void;
    fetchConversationBySlug: (slug: string) => Promise<void>;
    fetchConversationById: (id: string) => Promise<void>;
    fetchMembers: (conversationId: string, loadMore?: boolean) => Promise<void>;
    fetchAttachments: (
        conversationId: string,
        type: 'image' | 'file' | 'video' | 'audio',
        loadMore?: boolean,
    ) => Promise<void>;
};

export const useCurrentConversationStore = create<CurrentConversationState>((set, get) => ({
    conversation: null,
    members: [],
    media: [],
    files: [],
    hasMoreMedia: false,
    hasMoreFiles: false,
    hasMoreMembers: false,
    isLoading: false,
    isMembersLoading: false,
    isMediaLoading: false,
    isFilesLoading: false,
    hasJoined: false, // Initial state: user has not joined
    isJoining: false,
    isLeaving: false,
    joinChat: async (conversationId: string) => {
        set({ isJoining: true });
        try {
            await conversationService.joinConversation(conversationId);
            set({ hasJoined: true, isJoining: false });

            // Update local conversation state if it matches
            const currentConv = get().conversation;
            if (currentConv && currentConv.id === conversationId) {
                set({ conversation: { ...currentConv, is_joined: true } });
            }
        } catch (error) {
            console.error('Failed to join conversation:', error);
            set({ isJoining: false });
        }
    },
    leaveGroup: async (conversationId: string) => {
        set({ isLeaving: true });
        try {
            await conversationService.leaveConversation(conversationId);
            set({ hasJoined: false, isLeaving: false });

            // Update local conversation state if it matches
            const currentConv = get().conversation;
            if (currentConv && currentConv.id === conversationId) {
                set({ conversation: { ...currentConv, is_joined: false } });
            }
        } catch (error) {
            console.error('Failed to leave conversation:', error);
            set({ isLeaving: false });
            throw error;
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

            set({ conversation: conversation, isLoading: false, hasJoined: conversation.is_joined });
        } catch (error) {
            console.error('Failed to fetch conversation:', error);
            set({ isLoading: false });
        }
    },
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
    fetchMembers: async (conversationId: string, loadMore = false) => {
        if (get().hasJoined === false) return;
        set({ isMembersLoading: true });
        try {
            const currentMembers = get().members;
            const lastMember = loadMore && currentMembers.length > 0 ? currentMembers[currentMembers.length - 1] : null;

            const response = await conversationService.getMembers(conversationId, {
                limit: 20,
                before: lastMember?.joined_at,
                beforeId: lastMember?.id,
            });

            const { members: rawMembers, hasMore, total } = response.data;

            const mappedMembers: User[] = rawMembers.map((member) => ({
                id: member.user_id,
                name: member.name,
                username: member.username,
                avatar: member.picture || undefined,
                isOnline: member.is_online || false,
                joined_at: member.joined_at,
            }));

            const newMembers = loadMore ? [...currentMembers, ...mappedMembers] : mappedMembers;

            set({
                members: newMembers,
                isMembersLoading: false,
                hasMoreMembers: hasMore,
            });

            if (get().conversation && total !== undefined) {
                get().updateConversation(conversationId, { members_count: total });
            }
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

        set({ [loadingKey]: true } as { [key: string]: boolean });

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

            set({
                [dataKey]: loadMore ? [...currentItems, ...attachments] : attachments,
                [hasMoreKey]: hasMore,
                [loadingKey]: false,
            } as { [key: string]: Attachment[] | boolean });
        } catch (error) {
            console.error(`Failed to fetch ${type} attachments:`, error);
            set({ [loadingKey]: false } as { [key: string]: boolean });
        }
    },
}));
