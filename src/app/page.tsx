'use client';
import { useEffect } from 'react';

import instance from '@/config/axios';
import { useAuthStore } from '@/store/use-auth-store';
import axios from 'axios';

import AuthBox from '@/components/auth/auth-box';
import { Button } from '@/components/ui/button';

import { authService } from '@/services';

export default function Home() {
    const { user, isAuthenticated, login, setAccessToken } = useAuthStore();

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

        restoreSession();
    }, []);

    const handleRefreshUserInfo = async () => {
        try {
            const res = await authService.getMe();
            console.log('Refreshed user info:', res);
        } catch (error) {
            console.error('Failed to refresh user info:', error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-zinc-900">
            {isAuthenticated && user ? (
                <div className="text-center">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome, {user.name}!</h1>
                    <img
                        src={user?.picture}
                        alt="Avatar"
                        className="mx-auto mb-4 rounded-full"
                        width={150}
                        height={150}
                    />
                    <p className="text-gray-700 dark:text-gray-300">You are logged in as {user.email}.</p>

                    <Button onClick={handleRefreshUserInfo}>Refresh</Button>
                </div>
            ) : (
                <></>
            )}
            <AuthBox />
        </div>
    );
}
