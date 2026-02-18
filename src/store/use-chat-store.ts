import type { Message } from '@/types/chat.type';
import { create } from 'zustand';

import { conversationService } from '@/services';

// { messageId: { '👍': ['user1', 'user2'], '❤️': ['user3'] } }
type ReactionMap = Record<string, Record<string, string[]>>;

type ChatState = {
    messageReactions: ReactionMap;
    currentUserId: string; // This would typically come from an auth store
    replyingTo: Message | null;
    hasJoined: boolean; // New state to track if user has joined
    isJoining: boolean;
    joinChat: (conversationId: string) => Promise<void>; // New action to join
    toggleReaction: (messageId: string, emoji: string) => void;
    setReplyingTo: (message: Message | null) => void;
    cancelReply: () => void;
    removeMessage: (messageId: string) => void;
    reportMessage: (messageId: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
    messageReactions: {},
    currentUserId: 'user_me', // Hardcoded for demonstration
    replyingTo: null,
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
    toggleReaction: (messageId, emoji) => {
        set((state) => {
            const currentReactions = state.messageReactions[messageId] ?? {};
            const reactedUsers = currentReactions[emoji] ?? [];
            const currentUser = state.currentUserId;

            const newReactedUsers = reactedUsers.includes(currentUser)
                ? reactedUsers.filter((u) => u !== currentUser)
                : [...reactedUsers, currentUser];

            const newCurrentReactions = { ...currentReactions };

            if (newReactedUsers.length > 0) {
                newCurrentReactions[emoji] = newReactedUsers;
            } else {
                delete newCurrentReactions[emoji];
            }

            return {
                messageReactions: {
                    ...state.messageReactions,
                    [messageId]: newCurrentReactions,
                },
            };
        });
    },
    setReplyingTo: (message) => {
        set({ replyingTo: message });
    },
    cancelReply: () => {
        set({ replyingTo: null });
    },
    removeMessage: (messageId) => {
        console.log('Removing message:', messageId);
    },
    reportMessage: (messageId) => {
        console.log('Reporting message:', messageId);
    },
}));
