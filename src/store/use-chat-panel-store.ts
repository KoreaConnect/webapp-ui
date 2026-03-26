import { create } from 'zustand';

type ChatPanelStore = {
    isOpen: boolean;
    isSearchOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
    toggleSearch: () => void;
    openSearch: () => void;
    closeSearch: () => void;
};

export const useChatPanelStore = create<ChatPanelStore>((set) => ({
    isOpen: false,
    isSearchOpen: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    openSearch: () => set({ isSearchOpen: true }),
    closeSearch: () => set({ isSearchOpen: false }),
}));
