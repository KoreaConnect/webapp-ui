import { Message } from '@/types/chat.type';
import { create } from 'zustand';

interface ReplyStore {
    isOpenReplyBox: boolean;
    replyingTo: Message | null;
    setIsReplyBoxOpen: (isOpen: boolean) => void;
    setReplyingTo: (message: Message | null) => void;
    openReplyBox: (message: Message) => void;
    closeReplyBox: () => void;
}

export const useReplyStore = create<ReplyStore>((set) => ({
    isOpenReplyBox: false,
    replyingTo: null,
    setIsReplyBoxOpen: (isOpen: boolean) => set({ isOpenReplyBox: isOpen }),
    setReplyingTo: (message: Message | null) => set({ replyingTo: message }),
    openReplyBox: (message: Message) => set({ isOpenReplyBox: true, replyingTo: message }),
    closeReplyBox: () => {
        set({ isOpenReplyBox: false, replyingTo: null });
    },
}));
