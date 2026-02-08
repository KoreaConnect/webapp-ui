import { create } from 'zustand';

type ChatPanelStore = {
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
};

export const useChatPanelStore = create<ChatPanelStore>((set) => ({
    isOpen: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
