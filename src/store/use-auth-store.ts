import { closeSocket, getSocket } from '@/config/ws';
import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    accessToken?: string;
    isInitialized: boolean;
    setInitialized: (value: boolean) => void;
    setAccessToken: (accessToken: string) => void;
    login: (user: User, accessToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    accessToken: '',
    isInitialized: false,
    setInitialized: (value: boolean) => set({ isInitialized: value }),
    setAccessToken: (accessToken: string) => set({ accessToken }),
    login: (user: User, accessToken: string) => {
        set({ user, isAuthenticated: true, accessToken });
        console.log('accessToken:', accessToken);
        closeSocket();
        getSocket();
    },
    logout: () => {
        set({ user: null, isAuthenticated: false, accessToken: '' });
        closeSocket();
        getSocket();
    },
}));
