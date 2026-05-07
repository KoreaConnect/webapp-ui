'use client';

import * as React from 'react';

import { useAuthStore } from '@/store/use-auth-store';
import { Post } from '@/types/post.type';
import * as Dialog from '@radix-ui/react-dialog';
import { Globe2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import CloseButton from '@/components/ui/close-button';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { useDragScroll } from '@/hooks/use-drag-scroll';

import { cn } from '@/utils/cn';

import { formatDate } from '@/utils';

interface ReplyModalProps {
    parentPost: Post;
    onReply?: (data: { content: string; images: File[]; parent_id: string }) => Promise<void>;
    onClose?: () => void;
}

const MAX_IMAGES = 5;

export default function ReplyModal({ parentPost, onReply, onClose }: ReplyModalProps) {
    const { user } = useAuthStore();
    const [content, setContent] = React.useState('');
    const [images, setImages] = React.useState<File[]>([]);
    const [previews, setPreviews] = React.useState<string[]>([]);
    const [isPosting, setIsPosting] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const { scrollRef, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, style: dragStyle } = useDragScroll();

    // Auto-grow textarea height
    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [content]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > MAX_IMAGES) {
            const remainingSlots = MAX_IMAGES - images.length;
            if (remainingSlots <= 0) return;

            const allowedFiles = files.slice(0, remainingSlots);
            setImages((prev) => [...prev, ...allowedFiles]);
            const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        } else {
            setImages((prev) => [...prev, ...files]);
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
        if (e.target) e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previews[index]);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!content.trim() && images.length === 0) return;

        setIsPosting(true);
        try {
            if (onReply) {
                await onReply({ content, images, parent_id: parentPost.id });
            }
            setContent('');
            setImages([]);
            setPreviews([]);
            onClose?.();
        } catch (error) {
            console.error('Failed to post reply:', error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="flex flex-col w-full bg-white dark:bg-zinc-950 overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="w-10" />
                <Dialog.Title className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50">Reply</Dialog.Title>
                <Dialog.Close asChild>
                    <CloseButton size="sm" onClick={onClose} />
                </Dialog.Close>
            </div>

            <div className="overflow-y-auto max-h-[70vh] no-scrollbar">
                {/* Parent Post Preview */}
                <div className="p-4 flex gap-3 opacity-60">
                    <div className="flex flex-col items-center">
                        <Avatar
                            src={parentPost.user?.picture ?? undefined}
                            alt={parentPost.user?.name}
                            size="md"
                            className="ring-1 ring-zinc-100 dark:ring-zinc-800"
                        />
                        <div className="w-0.5 grow bg-zinc-100 dark:bg-zinc-800/50 my-2 rounded-full" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[14px]">{parentPost.user?.name}</span>
                            <span className="text-zinc-500 text-xs">{formatDate(parentPost.created_at)}</span>
                        </div>
                        <p className="text-[14px] leading-relaxed line-clamp-3">{parentPost.content}</p>
                    </div>
                </div>

                {/* Reply Content Area */}
                <div className="px-4 pb-4 flex gap-3">
                    {/* Left Column: Avatar & Connector */}
                    <div className="flex flex-col items-center">
                        <Avatar
                            src={user?.picture}
                            alt={user?.name}
                            size="md"
                            className="ring-1 ring-zinc-100 dark:ring-zinc-800"
                        />
                        <div className="w-0.5 grow bg-zinc-100 dark:bg-zinc-800 my-2 rounded-full min-h-[20px]" />
                    </div>

                    {/* Right Column: Editor */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0 pt-1">
                        <div className="font-bold text-[15px] text-zinc-900 dark:text-zinc-50 leading-none mb-2">
                            {user?.name || 'User'}
                        </div>

                        <textarea
                            ref={textareaRef}
                            autoFocus
                            placeholder={`Reply to ${parentPost.user?.name}...`}
                            className={cn(
                                'w-full bg-transparent border-none focus:ring-0 outline-none resize-none p-0',
                                'text-[16px] leading-[1.5]',
                                'text-zinc-900 dark:text-zinc-50',
                                'placeholder:text-zinc-400/70 dark:placeholder:text-zinc-600/70',
                                'min-h-[60px] transition-all duration-200',
                            )}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/* Image Previews */}
                        {previews.length > 0 && (
                            <ScrollableView
                                horizontal
                                vertical={false}
                                className="mt-3 select-none"
                                ref={scrollRef}
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                onMouseLeave={onMouseLeave}
                            >
                                <div className="flex gap-3 pb-2" style={dragStyle}>
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative shrink-0 group">
                                            <div className="w-48 h-36 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 relative">
                                                <Image
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105 duration-500 pointer-events-none"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-all shadow-lg z-10"
                                                title="Remove image"
                                            >
                                                <X size={12} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollableView>
                        )}

                        {/* Media Actions */}
                        <div className="flex items-center gap-4 mt-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={images.length >= MAX_IMAGES}
                                className={cn(
                                    'p-1.5 -ml-1.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors',
                                    'text-zinc-400 dark:text-zinc-600',
                                    images.length < MAX_IMAGES && 'hover:text-zinc-600 dark:hover:text-zinc-400',
                                    images.length >= MAX_IMAGES && 'opacity-30 cursor-not-allowed',
                                )}
                                title={`Add photos (max ${MAX_IMAGES})`}
                            >
                                <ImageIcon size={20} strokeWidth={2} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-4 mt-auto border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-600">
                        <Globe2 size={12} />
                        <span className="text-[13px] font-medium">Anyone can reply</span>
                    </div>
                </div>

                <Button
                    disabled={(!content.trim() && images.length === 0) || isPosting}
                    loading={isPosting}
                    onClick={handleSubmit}
                    className={cn(
                        'rounded-full px-6 font-bold h-9 transition-all duration-200',
                        'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200',
                    )}
                >
                    Reply
                </Button>
            </div>
        </div>
    );
}
