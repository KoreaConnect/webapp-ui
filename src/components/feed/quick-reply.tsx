'use client';

import { useEffect, useRef, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { Post } from '@/types/post.type';
import { Image as ImageIcon, Loader, SendHorizonal, X } from 'lucide-react';

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { postService } from '@/services';

import { getErrorMessage } from '@/utils/get-error-message';

const MAX_IMAGES = 5;

interface QuickReplyProps {
    mainPost: Post;
    onSuccess: () => void;
}

export default function QuickReply({ mainPost, onSuccess }: QuickReplyProps) {
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewsRef = useRef<string[]>([]);
    const { show } = useToastStore();

    useEffect(() => {
        previewsRef.current = previews;
    }, [previews]);

    useEffect(() => {
        return () => {
            previewsRef.current.forEach((p) => URL.revokeObjectURL(p));
        };
    }, []);

    const handleSubmit = async () => {
        if ((!content.trim() && images.length === 0) || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await postService.replyPost({
                content,
                images,
                parent_id: mainPost.id,
            });

            if (response.success) {
                setContent('');
                setImages([]);
                previews.forEach((p) => URL.revokeObjectURL(p));
                setPreviews([]);
                show({ type: 'success', message: 'Reply posted successfully!' });
                onSuccess();
            } else {
                throw new Error(getErrorMessage(response.error, 'Failed to post reply'));
            }
        } catch (error) {
            show({
                type: 'error',
                message: getErrorMessage(error, 'Something went wrong'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remainingSlots = MAX_IMAGES - images.length;
        if (remainingSlots <= 0) return;
        const allowedFiles = files.slice(0, remainingSlots);
        setImages((prev) => [...prev, ...allowedFiles]);
        const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
        if (e.target) e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previews[index]);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="flex gap-3">
                <Avatar
                    src={mainPost.user?.picture || ''}
                    alt={mainPost.user?.name}
                    size="sm"
                    fallback={mainPost.user?.name?.charAt(0) || 'U'}
                    className="ring-1 ring-zinc-100 dark:ring-zinc-800 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                    {previews.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative shrink-0 group">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-1.5 -right-1.5 p-0.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all shadow-lg"
                                    >
                                        <X size={10} strokeWidth={2.5} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Share your thoughts..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            className="flex-1 px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={images.length >= MAX_IMAGES}
                            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                            title={`Add photos (max ${MAX_IMAGES})`}
                        >
                            <ImageIcon size={16} strokeWidth={2} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={(!content.trim() && images.length === 0) || isSubmitting}
                            size="sm"
                            className="gap-1.5 shrink-0"
                        >
                            {isSubmitting ? (
                                <Loader className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <SendHorizonal className="w-3.5 h-3.5" />
                            )}
                            {isSubmitting ? 'Sending...' : 'Reply'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
