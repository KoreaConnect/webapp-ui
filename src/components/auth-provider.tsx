'use client';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/use-auth-store';

import { authService } from '@/services';

function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, login, setAccessToken } = useAuthStore();

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await authService.refreshToken();
                if (response?.data?.access_token) {
                    setAccessToken(response.data.access_token);
                }
                await authService.getMe().then((res) => {
                    login(res.data, response.data.access_token);
                });
            } catch {
                console.log('No active session found.');
            }
        };

        if (!isAuthenticated) {
            restoreSession();
        }
    }, [isAuthenticated, login, setAccessToken]);

    return <>{children}</>;
}

export default AuthProvider;
