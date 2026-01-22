'use client';

import React, { useState } from 'react';

import { ChevronLeft, X } from 'lucide-react';

import { AuthForm } from '@/components/auth/auth-form';
import { AuthMethods } from '@/components/auth/auth-methods';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { Button } from '@/components/ui/button';

type AuthBoxProp = {
    initialType?: 'login' | 'register';
};

function AuthBox({ initialType = 'login' }: AuthBoxProp) {
    const [type, setType] = useState<'login' | 'register'>(initialType);
    const [view, setView] = useState<'methods' | 'form' | 'forgot-password'>('methods');

    const handleToggleType = () => {
        setType(type === 'login' ? 'register' : 'login');
    };

    const getTitle = () => {
        if (view === 'forgot-password') return 'Quên mật khẩu?';
        return type === 'login' ? 'Đăng nhập vào Koco' : 'Đăng kí vào Koco';
    };

    const getDescription = () => {
        if (view === 'forgot-password') return 'Nhập email của bạn để nhận liên kết khôi phục mật khẩu';
        return type === 'login' ? 'Chào mừng bạn quay trở lại' : 'Chào mừng bạn đến với cộng đồng của chúng tôi';
    };

    const handleBack = () => {
        if (view === 'forgot-password') {
            setView('methods');
        } else if (view === 'form') {
            setView('methods');
        }
    };

    return (
        <div
            className="relative mx-auto w-full max-w-md space-y-6 rounded-2xl border
         border-zinc-200 bg-white p-8 px-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
            {view !== 'methods' && (
                <button
                    className="absolute left-4 top-4 rounded-full p-1 text-zinc-400 
                    hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
                    type="button"
                    onClick={handleBack}
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
            )}

            <button
                className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 
                hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
                type="button"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center space-y-2 pt-4 text-center">
                {/* GOM Logo Placeholder */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <span className="text-xl font-bold text-primary">GOM</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight">{getTitle()}</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{getDescription()}</p>
            </div>

            {view === 'methods' && <AuthMethods type={type} onEmailClick={() => setView('form')} />}

            {view === 'form' && <AuthForm type={type} />}

            {view === 'forgot-password' && <ForgotPasswordForm />}

            <div className="space-y-2">
                {view !== 'forgot-password' && type === 'login' && (
                    <Button variant="link" className="w-full" type="button" onClick={() => setView('forgot-password')}>
                        Quên mật khẩu?
                    </Button>
                )}

                {view !== 'forgot-password' && (
                    <div className="flex items-center justify-center gap-1 text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">
                            {type === 'login' ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'}
                        </span>
                        <Button
                            variant="link"
                            className="h-auto p-0 font-medium"
                            type="button"
                            onClick={handleToggleType}
                        >
                            {type === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                        </Button>
                    </div>
                )}
            </div>

            <p className="px-8 text-center text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Bằng cách đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của Koco.
            </p>
        </div>
    );
}

export default AuthBox;
