'use client';

import React from 'react';

import { useChatStore } from '@/store/use-chat-store';
import { Reply, X } from 'lucide-react';

export function ReplyBox() {
    const { replyingTo, cancelReply } = useChatStore();

    if (!replyingTo) {
        return null;
    }

    return (
        <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-800 p-3 border-t border-zinc-200 dark:border-zinc-700">
            <Reply size={20} className="text-zinc-500 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Replying to {replyingTo.name ?? replyingTo.sender}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{replyingTo.text}</p>
            </div>
            <button
                onClick={cancelReply}
                className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title="Cancel reply"
            >
                <X size={20} className="text-zinc-500" />
            </button>
        </div>
    );
}
