'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { Post, ThreadPost, ThreadResponse } from '@/types/post.type';
import { ChevronLeft, Image as ImageIcon, Send, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { FilePreview } from '@/components/chat/file-preview';
import { ThreadCard } from '@/components/feed/thread-card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { postService } from '@/services';

import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/get-error-message';

const MAX_IMAGES = 5;

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
    const [replyContent, setReplyContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<Post | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchThread = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await postService.getThread(id);
            if (response.success) {
                setThreadData(response.data);
                // Default to replying to the root post
                setReplyingTo(response.data.root);
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

    const handleReply = async () => {
        if ((!replyContent.trim() && selectedImages.length === 0) || !replyingTo) return;

        setIsSubmitting(true);
        try {
            const response = await postService.replyPost({
                content: replyContent,
                parent_id: replyingTo.id,
                images: selectedImages,
            });

            if (response.success) {
                setReplyContent('');
                setSelectedImages([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
                fetchThread(); // Refresh to show new reply
            }
        } catch (error) {
            show({
                type: 'error',
                message: getErrorMessage(error, 'Failed to send reply'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validImages = files.filter((file) => file.type.startsWith('image/'));

        if (validImages.length + selectedImages.length > MAX_IMAGES) {
            show({
                type: 'error',
                message: `You can only upload up to ${MAX_IMAGES} images.`,
            });
            return;
        }

        setSelectedImages((prev) => [...prev, ...validImages]);
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onReplyClick = (e: React.MouseEvent, post: Post) => {
        e.preventDefault();
        e.stopPropagation();
        setReplyingTo(post);
        textareaRef.current?.focus();
    };

    // Auto-grow textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [replyContent]);

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
        <div className="max-w-full min-h-screen bg-white dark:bg-zinc-950">
            <div className="pb-32">
                {/* Section Indicator: Root Thread */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <span className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em]">
                        Root Thread
                    </span>
                    <div className="h-[1px] grow bg-zinc-100/50 dark:bg-zinc-800/50" />
                </div>

                {/* Main Post */}
                <ThreadCard
                    post={mainPost}
                    isDetail
                    onReplyClick={onReplyClick}
                    showConnector={threadData.replies.length > 0}
                />

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

            {/* Quick Reply Bar */}
            <div className="sticky bottom-8 z-20 p-4 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="max-w-2xl mx-auto">
                    {replyingTo && replyingTo.id !== mainPost.id && (
                        <div className="flex items-center gap-2 mb-2 px-1 animate-in fade-in slide-in-from-bottom-2">
                            <span className="text-[13px] text-zinc-500">Replying to</span>
                            <span className="text-[13px] font-bold text-primary">@{replyingTo.user?.name}</span>
                            <button
                                onClick={() => setReplyingTo(mainPost)}
                                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                            >
                                <X size={12} className="text-zinc-400" />
                            </button>
                        </div>
                    )}

                    {selectedImages.length > 0 && (
                        <div className="mb-3">
                            <ScrollableView horizontal>
                                <div className="flex gap-2 p-1">
                                    {selectedImages.map((file, idx) => (
                                        <div key={idx} className="shrink-0 w-32">
                                            <FilePreview file={file} onRemove={() => removeImage(idx)} />
                                        </div>
                                    ))}
                                </div>
                            </ScrollableView>
                        </div>
                    )}

                    <div className="flex items-end gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="rounded-full w-10 h-10 p-0 shrink-0 mb-1"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <div className="flex-1 flex flex-col bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-2 px-4 border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />

                                <textarea
                                    ref={textareaRef}
                                    placeholder={
                                        replyingTo?.id === mainPost.id
                                            ? `Reply to ${mainPost.user?.name || 'thread'}...`
                                            : `Reply to ${replyingTo?.user?.name}...`
                                    }
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none resize-none py-2 text-[15px] max-h-32"
                                    rows={1}
                                />
                                <div className="flex items-center gap-2 pb-1.5">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={selectedImages.length >= MAX_IMAGES}
                                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1 disabled:opacity-30"
                                    >
                                        <ImageIcon size={20} />
                                    </button>
                                    <Button
                                        size="sm"
                                        disabled={(!replyContent.trim() && selectedImages.length === 0) || isSubmitting}
                                        onClick={handleReply}
                                        className="rounded-full w-8 h-8 p-0 shrink-0"
                                    >
                                        <Send size={14} className={cn(isSubmitting && 'animate-pulse')} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
