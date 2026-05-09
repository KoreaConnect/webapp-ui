'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { Post, ThreadPost, ThreadResponse } from '@/types/post.type';
import { useParams, useRouter } from 'next/navigation';

import { ThreadCard } from '@/components/feed/thread-card';
import ReplyModal from '@/components/reply-modal';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/ui/dialog';
import { Loader } from '@/components/ui/loader';

import { postService } from '@/services';

import { getErrorMessage } from '@/utils/get-error-message';

interface RecursiveRepliesProps {
    replies: ThreadPost[];
    onReplyClick: (e: React.MouseEvent, post: Post) => void;
    parentUser?: string;
}

const RecursiveReplies: React.FC<RecursiveRepliesProps> = ({ replies, onReplyClick, parentUser }) => {
    return (
        <>
            {replies.map((reply) => (
                <div key={reply.id}>
                    <ThreadCard
                        post={reply}
                        isReply
                        showConnector={reply.replies.length > 0}
                        onReplyClick={onReplyClick}
                        replyToUser={parentUser}
                        style={{
                            marginLeft: reply.depth < 4 ? `${(reply.depth - 1) * 24}px` : `${2 * 24}px`,
                            bottom: '16px',
                        }}
                    />
                    {reply.replies.length > 0 && (
                        <RecursiveReplies
                            replies={reply.replies}
                            onReplyClick={onReplyClick}
                            parentUser={reply.user?.name}
                        />
                    )}
                </div>
            ))}
        </>
    );
};

export default function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { show } = useToastStore();
    const [threadData, setThreadData] = useState<ThreadResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const fetchThread = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await postService.getThread(id);
            if (response.success) {
                setThreadData(response.data);
            }
        } catch (error) {
            show({
                type: 'error',
                message: getErrorMessage(error, 'Failed to load post'),
            });
        } finally {
            setIsLoading(false);
        }
    }, [id, show]);

    useEffect(() => {
        if (id) fetchThread();
    }, [id, fetchThread]);

    const handleReplyPost = async (data: { content: string; images: File[]; parent_id: string }) => {
        try {
            const response = await postService.replyPost(data);

            if (response.success) {
                show({
                    type: 'success',
                    message: 'Reply posted successfully!',
                });
                fetchThread(); // Refresh thread
            } else {
                throw new Error(getErrorMessage(response.error, 'Failed to post reply'));
            }
        } catch (error) {
            show({
                type: 'error',
                message: getErrorMessage(error, 'Something went wrong'),
            });
            throw error;
        }
    };

    const onReplyClick = (e: React.MouseEvent, post: Post) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedPost(post);
        setIsReplyOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader size={24} />
                <p className="text-zinc-500 text-sm">Loading thread...</p>
            </div>
        );
    }

    if (!threadData || !threadData.root) {
        return (
            <div className="text-center py-20 text-zinc-500">
                <p>Post not found</p>
                <Button variant="ghost" onClick={() => router.back()} className="mt-4">
                    Go back
                </Button>
            </div>
        );
    }

    const mainPost = threadData.root;

    return (
        <div className="flex flex-col max-w-full min-h-full bg-white dark:bg-zinc-950">
            <div className="flex-1">
                {/* Section Indicator: Root Thread */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <span className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em]">
                        Root Thread
                    </span>
                    <div className="h-[1px] grow bg-zinc-100/50 dark:bg-zinc-800/50" />
                </div>

                {/* Main Post */}
                <ThreadCard post={mainPost} isDetail onReplyClick={onReplyClick} showConnector={false} />

                {/* Section Indicator: Reply Thread */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <span className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em]">
                        Reply Thread
                    </span>
                    <div className="h-[1px] grow bg-zinc-100/50 dark:bg-zinc-800/50" />
                    {threadData.replies.length > 0 && (
                        <span className="text-[11px] font-bold text-zinc-400">{threadData.replies.length}</span>
                    )}
                </div>

                {/* Recursive Replies */}
                <div className="mt-0">
                    {threadData.replies.length > 0 ? (
                        <RecursiveReplies
                            replies={threadData.replies}
                            onReplyClick={onReplyClick}
                            parentUser={mainPost.user?.name}
                        />
                    ) : (
                        <div className="text-center py-10 text-zinc-500 text-sm italic">No replies yet.</div>
                    )}
                </div>
            </div>

            {/* Hidden Reply Dialog */}
            {selectedPost && (
                <DialogWrapper open={isReplyOpen} onOpenChange={setIsReplyOpen}>
                    <ReplyModal
                        parentPost={selectedPost}
                        onReply={handleReplyPost}
                        onClose={() => setIsReplyOpen(false)}
                    />
                </DialogWrapper>
            )}
        </div>
    );
}
