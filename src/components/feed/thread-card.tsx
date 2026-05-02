'use client';

import React from 'react';

import { Post } from '@/types/post.type';
import { Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Avatar from '@/components/ui/avatar';

import { useDragScroll } from '@/hooks/use-drag-scroll';

import { cn } from '@/utils/cn';

import { formatDate } from '@/utils';

interface ThreadCardProps {
    post: Post;
    onReplyClick?: (e: React.MouseEvent, post: Post) => void;
    isDetail?: boolean;
    isReply?: boolean;
    showConnector?: boolean;
    className?: string;
    replyToUser?: string;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
    post,
    onReplyClick,
    isDetail = false,
    isReply = false,
    showConnector = true,
    className,
    replyToUser,
}) => {
    const router = useRouter();
    const { scrollRef, ...dragEvents } = useDragScroll();

    const handleContentClick = (e: React.MouseEvent) => {
        if (isDetail) return;
        router.push(`/feed/${post.id}`);
    };

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    return (
        <div
            className={cn(
                'p-4 transition-colors group',
                !isDetail &&
                    'hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50',
                isDetail && 'border-b border-zinc-100 dark:border-zinc-800/50',
                className,
            )}
        >
            <div className="flex gap-3">
                {/* Left Column: Avatar & Connector Line */}
                <div className="flex flex-col items-center">
                    <Avatar
                        src={post.user?.picture || ''}
                        alt={post.user?.name}
                        size={isReply ? 'sm' : 'md'}
                        className="ring-1 ring-zinc-100 dark:ring-zinc-800"
                    />
                    {showConnector && (
                        <div
                            className={cn(
                                'w-0.5 grow bg-zinc-100 dark:bg-zinc-800/60 my-2 rounded-full',
                                isReply && 'bg-zinc-100 dark:bg-zinc-800/30',
                            )}
                        />
                    )}
                    {!isReply && !isDetail && (
                        <div className="flex -space-x-2 mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                            <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 ring-2 ring-white dark:ring-zinc-950" />
                            <div className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-600 ring-2 ring-white dark:ring-zinc-950" />
                        </div>
                    )}
                </div>

                {/* Right Column: Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                            <span
                                className={cn(
                                    'font-bold text-zinc-900 dark:text-zinc-50 hover:underline truncate',
                                    isReply ? 'text-[14px]' : 'text-[15px]',
                                )}
                            >
                                {post.user?.name || 'Unknown User'}
                            </span>
                            {post.topic && (
                                <span className="px-1.5 py-0.5 rounded bg-primary/5 dark:bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-tight border border-primary/10">
                                    {post.topic}
                                </span>
                            )}
                            <span className="text-zinc-400 dark:text-zinc-500 text-sm whitespace-nowrap">
                                {formatDate(post.created_at)}
                            </span>
                        </div>
                        <button
                            onClick={handleActionClick}
                            className="p-1.5 -mr-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <div onClick={handleContentClick} className={cn(!isDetail && 'cursor-pointer')}>
                        {replyToUser && (
                            <div className="flex items-center gap-1 mb-1 text-[13px] text-zinc-500">
                                <span>Replying to</span>
                                <span className="text-primary font-medium hover:underline">@{replyToUser}</span>
                            </div>
                        )}
                        <p
                            className={cn(
                                'leading-[1.5] text-zinc-800 dark:text-zinc-200 mb-3 whitespace-pre-wrap break-words',
                                isDetail && !isReply ? 'text-[17px] font-medium' : 'text-[15px]',
                            )}
                        >
                            {post.content}
                        </p>

                        {post.images && post.images.length > 0 && (
                            <div className="mb-4 -mx-1">
                                <div
                                    ref={scrollRef}
                                    {...dragEvents}
                                    className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar select-none"
                                >
                                    {post.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                'relative flex-none aspect-[16/10] rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 snap-start',
                                                isReply ? 'w-[75%]' : 'w-[85%]',
                                            )}
                                        >
                                            <img
                                                src={image}
                                                alt={`Post image ${index + 1}`}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                draggable={false}
                                                className="object-cover transition-transform group-hover:scale-[1.02] duration-500 pointer-events-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className={cn(
                            'flex gap-5 text-zinc-500 dark:text-zinc-400',
                            isDetail && !isReply && 'border-t border-zinc-100 dark:border-zinc-800/50 pt-3',
                        )}
                    >
                        <button
                            onClick={handleActionClick}
                            className="flex items-center gap-1.5 group/btn hover:text-rose-500 transition-colors"
                        >
                            <div className="p-1.5 rounded-full group-hover/btn:bg-rose-50 dark:group-hover/btn:bg-rose-500/10">
                                <Heart className={isDetail ? 'w-[20px] h-[20px]' : 'w-[18px] h-[18px]'} />
                            </div>
                            <span className="text-xs font-medium">0</span>
                        </button>
                        <button
                            onClick={(e) => {
                                handleActionClick(e);
                                onReplyClick?.(e, post);
                            }}
                            className="flex items-center gap-1.5 group/btn hover:text-primary transition-colors"
                        >
                            <div className="p-1.5 rounded-full group-hover/btn:bg-primary/5 dark:group-hover/btn:bg-primary/10">
                                <MessageCircle className={isDetail ? 'w-[20px] h-[20px]' : 'w-[18px] h-[18px]'} />
                            </div>
                            <span className="text-xs font-medium">{post.reply_count || 0}</span>
                        </button>
                        <button
                            onClick={handleActionClick}
                            className="flex items-center gap-1.5 group/btn hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        >
                            <div className="p-1.5 rounded-full group-hover/btn:bg-zinc-100 dark:group-hover/btn:bg-zinc-800">
                                <Share2 className={isDetail ? 'w-[20px] h-[20px]' : 'w-[18px] h-[18px]'} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
