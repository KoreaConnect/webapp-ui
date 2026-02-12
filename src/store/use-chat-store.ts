import { create } from 'zustand';

// A mock message type, in a real app this would be more detailed
type Message = {
    id: string;
    text: string;
    sender: 'me' | 'other';
    name?: string;
};

// { messageId: { '👍': ['user1', 'user2'], '❤️': ['user3'] } }
type ReactionMap = Record<string, Record<string, string[]>>;

type ChatState = {
    messageReactions: ReactionMap;
    currentUserId: string; // This would typically come from an auth store
    replyingTo: Message | null;
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
