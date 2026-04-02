'use client';

import type { Message } from '@/types/chat.type';

type SystemMessageProps = {
    message: Message;
};

export function SystemMessage({ message }: SystemMessageProps) {
    const { metadata } = message;

    if (!metadata) return null;

    const renderContent = () => {
        switch (metadata.type) {
            case 'USER_JOINED':
                return (
                    <span className="text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold">
                            {metadata.target_user?.name || metadata.target_user?.username || 'Someone'}
                        </span>{' '}
                        joined the conversation
                    </span>
                );
            case 'USER_LEFT':
                return (
                    <span className="text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold">
                            {metadata.target_user?.name || metadata.target_user?.username || 'Someone'}
                        </span>{' '}
                        left the conversation
                    </span>
                );
            default:
                return <span className="text-zinc-500 dark:text-zinc-400">{message.content || message.text}</span>;
        }
    };

    return (
        <div className="flex w-full items-center justify-center py-4">
            <div className="rounded-full bg-zinc-100 dark:bg-zinc-800/50 px-4 py-1 text-xs">{renderContent()}</div>
        </div>
    );
}
