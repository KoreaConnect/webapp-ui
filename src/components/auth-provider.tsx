'use client';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/use-auth-store';
import { useToastStore } from '@/store/use-toast-store';

import { authService } from '@/services';

import { getErrorMessage } from '@/utils';

function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, login, setAccessToken } = useAuthStore();
    const { show } = useToastStore();

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
            } catch (error) {
                show({
                    type: 'error',
                    message: getErrorMessage(error, 'Failed to restore session. Please log in again.'),
                });
            }
        };

        if (!isAuthenticated) {
            restoreSession();
        }
    }, [isAuthenticated, login, setAccessToken]);

    return <>{children}</>;
}

export default AuthProvider;
