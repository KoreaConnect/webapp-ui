'use client';
import { useEffect } from 'react';

import instance from '@/config/axios';
import { useAuthStore } from '@/store/use-auth-store';

import AuthBox from '@/components/auth/auth-box';

export default function Home() {
    const { user, isAuthenticated } = useAuthStore();
    useEffect(() => {
        if (!isAuthenticated) {
            const refreshToken = async () => {
                try {
                    const response = await instance.post(
                        '/auth/refresh-token',
                        {},
                        {
                            withCredentials: true,
                        },
                    );

                    console.log('Refresh token response:', response.data);
                    if (response.data && response.data.token) {
                        console.log('Token refreshed successfully');
                    }
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                }
            };
            refreshToken();
        }
    }, [isAuthenticated]);
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
                </div>
            ) : (
                <></>
            )}
            <AuthBox />
        </div>
    );
}
