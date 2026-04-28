'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { ThreadResponse } from '@/types/post.type';
import { ChevronLeft, Image as ImageIcon, Send } from 'lucide-react';
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

export default function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { show } = useToastStore();
    const [threadData, setThreadData] = useState<ThreadResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleReply = async () => {
        if ((!replyContent.trim() && selectedImages.length === 0) || !threadData?.main_chain?.length) return;

        const targetPost = threadData.main_chain[threadData.main_chain.length - 1];

        setIsSubmitting(true);
        try {
            const response = await postService.replyPost({
                content: replyContent,
                parent_id: targetPost.id,
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
                <Loader size="lg" />
                <p className="text-zinc-500 text-sm">Loading thread...</p>
            </div>
        );
    }

    if (!threadData || !threadData.main_chain?.length) {
        return (
            <div className="text-center py-20 text-zinc-500">
                <p>Post not found</p>
                <Button variant="ghost" onClick={() => router.back()} className="mt-4">
                    Go back
                </Button>
            </div>
        );
    }

    const mainPost = threadData.main_chain[threadData.main_chain.length - 1];
    const parentChain = threadData.main_chain.slice(0, -1);

    return (
        <div className="max-w-full min-h-screen bg-white dark:bg-zinc-950">
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 flex items-center gap-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/50">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-full w-10 h-10 p-0">
                    <ChevronLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-xl">Thread</h1>
            </div>

            <div className="pb-32">
                {/* Parent Chain (if any) */}
                {parentChain.map((post) => (
                    <ThreadCard key={post.id} post={post} className="opacity-60 hover:opacity-100" />
                ))}

                {/* Main Post */}
                <ThreadCard post={mainPost} isDetail />

                {/* Replies */}
                <div className="mt-2">
                    {threadData.replies?.map((reply) => (
                        <ThreadCard key={reply.id} post={reply} isReply showConnector={false} />
                    ))}
                    {!threadData.replies?.length && (
                        <div className="text-center py-10 text-zinc-500 text-sm">No replies yet.</div>
                    )}
                </div>
            </div>

            {/* Quick Reply Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800/50 max-w-370 mx-auto z-20">
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

                <div className="flex items-end gap-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-2 px-4 border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
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
                        placeholder={`Reply to ${mainPost.user?.name || 'thread'}...`}
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
    );
}
