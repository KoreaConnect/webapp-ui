import { useAuthStore } from '@/store/use-auth-store';
import type { Message } from '@/types/chat.type';
import { create } from 'zustand';

import { conversationService } from '@/services';

// { messageId: { '👍': ['user1', 'user2'], '❤️': ['user3'] } }
type ReactionMap = Record<string, Record<string, string[]>>;

type ChatState = {
    messageReactions: ReactionMap;
    hasJoined: boolean; // New state to track if user has joined
    isJoining: boolean;
    joinChat: (conversationId: string) => Promise<void>; // New action to join
    toggleReaction: (messageId: string, emoji: string) => Promise<void>;
    setReaction: (messageId: string, emoji: string, userIds: string[]) => void;
    addReactionToState: (messageId: string, emoji: string, userId: string) => void;
    removeReactionFromState: (messageId: string, emoji: string, userId: string) => void;
    setMessageReactions: (reactions: ReactionMap) => void;
    removeMessage: (messageId: string) => void;
    reportMessage: (messageId: string) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
    messageReactions: {},
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
    setMessageReactions: (reactions) => {
        set((state) => ({
            messageReactions: {
                ...state.messageReactions,
                ...reactions,
            },
        }));
    },
    addReactionToState: (messageId, emoji, userId) => {
        set((state) => {
            const nextReactions = { ...state.messageReactions };
            const nextMessageReactions = { ...(nextReactions[messageId] ?? {}) };

            // 1. Remove this user from ANY existing reaction on this message first
            Object.keys(nextMessageReactions).forEach((key) => {
                nextMessageReactions[key] = nextMessageReactions[key].filter((u) => u !== userId);
                if (nextMessageReactions[key].length === 0) {
                    delete nextMessageReactions[key];
                }
            });

            // 2. Add the new reaction
            const users = nextMessageReactions[emoji] ?? [];
            nextMessageReactions[emoji] = [...users, userId];

            nextReactions[messageId] = nextMessageReactions;
            return { messageReactions: nextReactions };
        });
    },
    removeReactionFromState: (messageId, emoji, userId) => {
        set((state) => {
            const nextReactions = { ...state.messageReactions };
            const nextMessageReactions = { ...(nextReactions[messageId] ?? {}) };
            const users = nextMessageReactions[emoji] ?? [];

            nextMessageReactions[emoji] = users.filter((u) => u !== userId);
            if (nextMessageReactions[emoji].length === 0) {
                delete nextMessageReactions[emoji];
            }

            nextReactions[messageId] = nextMessageReactions;
            return { messageReactions: nextReactions };
        });
    },
    setReaction: (messageId, emoji, userIds) => {
        set((state) => {
            const nextReactions = { ...state.messageReactions };
            const nextMessageReactions = { ...(nextReactions[messageId] ?? {}) };

            if (userIds.length > 0) {
                nextMessageReactions[emoji] = userIds;
            } else {
                delete nextMessageReactions[emoji];
            }

            nextReactions[messageId] = nextMessageReactions;
            return { messageReactions: nextReactions };
        });
    },
    toggleReaction: async (messageId, emoji) => {
        const currentUser = useAuthStore.getState().user?.id;
        if (!currentUser) return;

        const userIdStr = currentUser.toString();
        const currentMessageReactions = get().messageReactions[messageId] ?? {};

        // Find if user already has ANY reaction on this message
        let existingEmoji: string | null = null;
        for (const [key, users] of Object.entries(currentMessageReactions)) {
            if (users.includes(userIdStr)) {
                existingEmoji = key;
                break;
            }
        }

        const isSameEmoji = existingEmoji === emoji;

        // Optimistic update
        set((state) => {
            const nextReactions = { ...state.messageReactions };
            const nextMessageReactions = { ...(nextReactions[messageId] ?? {}) };

            // 1. Remove previous reaction if it exists
            if (existingEmoji) {
                nextMessageReactions[existingEmoji] = (nextMessageReactions[existingEmoji] ?? []).filter(
                    (u) => u !== userIdStr,
                );
                if (nextMessageReactions[existingEmoji].length === 0) {
                    delete nextMessageReactions[existingEmoji];
                }
            }

            // 2. Add new reaction if it's different from the old one
            if (!isSameEmoji) {
                nextMessageReactions[emoji] = [...(nextMessageReactions[emoji] ?? []), userIdStr];
            }

            nextReactions[messageId] = nextMessageReactions;
            return { messageReactions: nextReactions };
        });

        try {
            if (isSameEmoji) {
                // If clicking the same one, just remove it
                await conversationService.removeReaction(messageId, emoji);
            } else {
                // If clicking a different one (or first one), the backend should handle replacing
                // but we call addReaction which should be idempotent or handle the swap
                await conversationService.addReaction(messageId, emoji);
            }
        } catch (error) {
            console.error('Failed to toggle reaction on server:', error);
            // Revert to original state on error
            set({ messageReactions: { ...get().messageReactions, [messageId]: currentMessageReactions } });
        }
    },
    removeMessage: (messageId) => {
        console.log('Removing message:', messageId);
    },
    reportMessage: (messageId) => {
        console.log('Reporting message:', messageId);
    },
}));
