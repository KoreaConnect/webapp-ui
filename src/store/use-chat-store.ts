import { create } from 'zustand';

// { messageId: { '👍': ['user1', 'user2'], '❤️': ['user3'] } }
type ReactionMap = Record<string, Record<string, string[]>>;

type ChatState = {
    messageReactions: ReactionMap;
    currentUserId: string; // This would typically come from an auth store
    toggleReaction: (messageId: string, emoji: string) => void;
    replyTo: (messageId: string) => void;
    removeMessage: (messageId: string) => void;
    reportMessage: (messageId: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
    messageReactions: {},
    currentUserId: 'user_me', // Hardcoded for demonstration
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
    replyTo: (messageId) => {
        console.log('Replying to message:', messageId);
    },
    removeMessage: (messageId) => {
        console.log('Removing message:', messageId);
    },
    reportMessage: (messageId) => {
        console.log('Reporting message:', messageId);
    },
}));
