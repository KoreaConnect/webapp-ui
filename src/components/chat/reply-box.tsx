'use client';

import React from 'react';

import { useReplyStore } from '@/store/use-reply-store';
import { Reply, X } from 'lucide-react';

import { cn } from '@/utils';

export function ReplyBox() {
    const { isOpenReplyBox, replyingTo, closeReplyBox } = useReplyStore();

    const getReplyText = () => {
        if (!replyingTo) return '';
        const content = replyingTo.text || replyingTo.content;
        const isMedia = replyingTo.attachments && replyingTo.attachments.length > 0;
        if (content) {
            return content;
        }
        if (isMedia) {
            return 'Media message';
        }
        return '';
    };

    return (
        <div
            className={cn(
                'overflow-hidden transition-all duration-200 ease-in-out border-border',
                isOpenReplyBox ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 border-none transition-none',
            )}
        >
            <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-800/50 p-3 border-t border-border backdrop-blur-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
                    <Reply size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Replying to</span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {replyingTo?.sender?.name || replyingTo?.sender?.username || 'Unknown User'}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate italic">{getReplyText()}</p>
                </div>
                <button
                    onClick={closeReplyBox}
                    className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors group"
                    title="Cancel reply"
                >
                    <X size={18} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
                </button>
            </div>
        </div>
    );
}
