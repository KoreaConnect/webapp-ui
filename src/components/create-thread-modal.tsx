'use client';

import * as React from 'react';

import { useAuthStore } from '@/store/use-auth-store';
import * as Dialog from '@radix-ui/react-dialog';
import { Globe2, Hash, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import CloseButton from '@/components/ui/close-button';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { useDragScroll } from '@/hooks/use-drag-scroll';

import { cn } from '@/utils/cn';

interface CreateThreadModalProps {
    onPost?: (data: { content: string; topic: string; images: File[] }) => void;
    onClose?: () => void;
}

export default function CreateThreadModal({ onPost, onClose }: CreateThreadModalProps) {
    const { user } = useAuthStore();
    const [content, setContent] = React.useState('');
    const [topic, setTopic] = React.useState('');
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
        if (images.length + files.length > 2) {
            // Limit to 2 images
            const remainingSlots = 2 - images.length;
            if (remainingSlots <= 0) return;

            const allowedFiles = files.slice(0, remainingSlots);
            const newImages = [...images, ...allowedFiles];
            setImages(newImages);

            const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file));
            setPreviews([...previews, ...newPreviews]);
        } else {
            const newImages = [...images, ...files];
            setImages(newImages);

            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews([...previews, ...newPreviews]);
        }

        // Reset input value to allow selecting same file again
        if (e.target) e.target.value = '';
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async () => {
        if (!content.trim() && images.length === 0) return;

        setIsPosting(true);
        try {
            if (onPost) {
                await onPost({ content, topic, images });
            } else {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log('Thread posted:', { content, topic, images });
            }

            // Clear state and close
            setContent('');
            setTopic('');
            setImages([]);
            setPreviews([]);
            onClose?.();
        } catch (error) {
            console.error('Failed to post thread:', error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="flex flex-col w-full bg-white dark:bg-zinc-950 overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="w-10" />
                <Dialog.Title className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50">
                    New thread
                </Dialog.Title>
                <Dialog.Close asChild>
                    <CloseButton size="sm" onClick={onClose} />
                </Dialog.Close>
            </div>

            {/* Content Area */}
            <div className="p-4 flex gap-3 overflow-y-auto max-h-[70vh] no-scrollbar">
                {/* Left Column: Avatar & Connector */}
                <div className="flex flex-col items-center">
                    <Avatar
                        src={user?.picture}
                        alt={user?.name}
                        size="md"
                        className="ring-1 ring-zinc-100 dark:ring-zinc-800"
                    />
                    <div className="w-0.5 grow bg-zinc-100 dark:bg-zinc-800 my-2 rounded-full" />
                    <div className="relative opacity-40">
                        <Avatar src={user?.picture} alt={user?.name} size={20} className="grayscale" />
                    </div>
                </div>

                {/* Right Column: Editor */}
                <div className="flex-1 flex flex-col gap-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-[15px] text-zinc-900 dark:text-zinc-50 leading-none">
                            {user?.name || 'User'}
                        </div>
                        <div
                            className={cn(
                                'flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all cursor-text group',
                                'bg-zinc-100 dark:bg-zinc-800',
                                'hover:bg-zinc-200 dark:hover:bg-zinc-700',
                                'focus-within:ring-1 focus-within:ring-primary/20 focus-within:bg-white dark:focus-within:bg-zinc-900 border border-transparent focus-within:border-primary/30',
                            )}
                        >
                            <Hash
                                size={11}
                                className="text-zinc-400 group-focus-within:text-primary transition-colors"
                            />
                            <input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="topic"
                                className="bg-transparent border-none p-0 text-[12px] w-16 sm:w-20 focus:ring-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-700 dark:text-zinc-300 font-semibold outline-none"
                            />
                        </div>
                    </div>

                    <textarea
                        ref={textareaRef}
                        autoFocus
                        placeholder="Start a thread..."
                        className={cn(
                            'w-full bg-transparent border-none focus:ring-0 outline-none resize-none p-0 mt-2',
                            'text-[16px] sm:text-[18px] leading-[1.6] font-medium tracking-tight',
                            'text-zinc-900 dark:text-zinc-50',
                            'placeholder:text-zinc-400/70 dark:placeholder:text-zinc-600/70',
                            'min-h-[100px] transition-all duration-200',
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
                                        <div className="w-64 h-48 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 relative">
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
                                            <X size={14} strokeWidth={2.5} />
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
                            disabled={images.length >= 2}
                            className={cn(
                                'p-1.5 -ml-1.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors',
                                'text-zinc-400 dark:text-zinc-600',
                                images.length < 2 && 'hover:text-zinc-600 dark:hover:text-zinc-400',
                                images.length >= 2 && 'opacity-30 cursor-not-allowed',
                            )}
                            title="Add photos (max 2)"
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

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-4 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-600">
                        <Globe2 size={12} />
                        <span className="text-[13px] font-medium hidden sm:inline">Anyone can reply</span>
                    </div>
                </div>

                <Button
                    disabled={!content.trim() && images.length === 0}
                    loading={isPosting}
                    onClick={handleSubmit}
                    className={cn(
                        'rounded-full px-6 font-bold h-9 transition-all duration-200',
                        'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200',
                        !content.trim() && images.length === 0 && 'opacity-30',
                    )}
                >
                    Post
                </Button>
            </div>
        </div>
    );
}
