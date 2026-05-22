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
    onPost?: (data: { topic: string; posts: { content: string; images: File[] }[] }) => void;
    onClose?: () => void;
}

interface ThreadItem {
    id: string;
    content: string;
    images: File[];
    previews: string[];
}

export default function CreateThreadModal({ onPost, onClose }: CreateThreadModalProps) {
    const { user } = useAuthStore();
    const [topic, setTopic] = React.useState('');
    const [threads, setThreads] = React.useState<ThreadItem[]>([
        { id: Math.random().toString(), content: '', images: [], previews: [] },
    ]);
    const [isPosting, setIsPosting] = React.useState(false);

    const textareaRefs = React.useRef<(HTMLTextAreaElement | null)[]>([]);

    const handleContentChange = (index: number, value: string) => {
        const newThreads = [...threads];
        newThreads[index].content = value;
        setThreads(newThreads);

        // Auto-grow height
        const textarea = textareaRefs.current[index];
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Images are only allowed on the first post (index 0)
        const files = Array.from(e.target.files || []);
        const thread = threads[0];

        if (thread.images.length + files.length > 2) {
            const remainingSlots = 2 - thread.images.length;
            if (remainingSlots <= 0) return;

            const allowedFiles = files.slice(0, remainingSlots);
            const newImages = [...thread.images, ...allowedFiles];
            const newPreviews = [...thread.previews, ...allowedFiles.map((file) => URL.createObjectURL(file))];

            const newThreads = [...threads];
            newThreads[0] = { ...thread, images: newImages, previews: newPreviews };
            setThreads(newThreads);
        } else {
            const newImages = [...thread.images, ...files];
            const newPreviews = [...thread.previews, ...files.map((file) => URL.createObjectURL(file))];

            const newThreads = [...threads];
            newThreads[0] = { ...thread, images: newImages, previews: newPreviews };
            setThreads(newThreads);
        }

        if (e.target) e.target.value = '';
    };

    const removeImage = (imageIndex: number) => {
        // Images are only on the first post
        const newThreads = [...threads];
        const thread = newThreads[0];

        const newImages = [...thread.images];
        newImages.splice(imageIndex, 1);

        const newPreviews = [...thread.previews];
        URL.revokeObjectURL(newPreviews[imageIndex]);
        newPreviews.splice(imageIndex, 1);

        newThreads[0] = { ...thread, images: newImages, previews: newPreviews };
        setThreads(newThreads);
    };

    const addNewThread = () => {
        // New thread items don't have images
        setThreads([...threads, { id: Math.random().toString(), content: '', images: [], previews: [] }]);
        // Focus new textarea in next tick
        setTimeout(() => {
            textareaRefs.current[threads.length]?.focus();
        }, 0);
    };

    const removeThread = (index: number) => {
        if (threads.length <= 1) return;
        const newThreads = [...threads];
        // If it was the first post (index 0), it shouldn't be removable
        if (index === 0) return;

        newThreads.splice(index, 1);
        setThreads(newThreads);
    };

    const handleSubmit = async () => {
        const hasContent = threads.some((t) => t.content.trim() || t.images.length > 0);
        if (!hasContent) return;

        setIsPosting(true);
        try {
            const posts = threads
                .filter((t, i) => t.content.trim() || (i === 0 && t.images.length > 0))
                .map((t) => ({
                    content: t.content,
                    images: t.images,
                }));

            if (onPost) {
                await onPost({ topic, posts });
            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log('Threads posted:', { topic, posts });
            }

            // Clear state and close
            setTopic('');
            threads[0].previews.forEach((url) => URL.revokeObjectURL(url));
            setThreads([{ id: Math.random().toString(), content: '', images: [], previews: [] }]);
            onClose?.();
        } catch (error) {
            console.error('Failed to post thread:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const canPost = threads.some((t) => t.content.trim() || t.images.length > 0);

    return (
        <div className="flex flex-col w-full bg-white dark:bg-zinc-950 overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh]">
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
            <div className="flex-1 overflow-y-auto no-scrollbar p-4">
                {threads.map((thread, index) => (
                    <ThreadEditor
                        key={thread.id}
                        thread={thread}
                        isFirst={index === 0}
                        user={user}
                        topic={topic}
                        setTopic={setTopic}
                        onContentChange={(val) => handleContentChange(index, val)}
                        onImageChange={handleImageChange}
                        onRemoveImage={removeImage}
                        onRemoveThread={() => removeThread(index)}
                        textareaRef={(el) => (textareaRefs.current[index] = el)}
                        showRemove={threads.length > 1}
                    />
                ))}

                {/* Add to thread button */}
                <div className="flex gap-3 -mt-3 group cursor-pointer pb-8" onClick={addNewThread}>
                    <div className="flex flex-col items-center w-10">
                        <div className="relative opacity-40 group-hover:opacity-60 transition-opacity mt-1">
                            <Avatar src={user?.picture} alt={user?.name} size={20} className="grayscale" />
                        </div>
                    </div>
                    <div className="flex-1 py-1">
                        <span className="text-zinc-400 dark:text-zinc-500 text-[15px] group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors">
                            Add to thread
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-600">
                        <Globe2 size={12} />
                        <span className="text-[13px] font-medium hidden sm:inline">Anyone can reply</span>
                    </div>
                </div>

                <Button
                    disabled={!canPost}
                    loading={isPosting}
                    onClick={handleSubmit}
                    className={cn(
                        'rounded-full px-6 font-bold h-9 transition-all duration-200',
                        'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200',
                        !canPost && 'opacity-30',
                    )}
                >
                    Post
                </Button>
            </div>
        </div>
    );
}

interface ThreadEditorProps {
    thread: ThreadItem;
    isFirst: boolean;
    user: { name?: string; picture?: string } | null;
    topic: string;
    setTopic: (val: string) => void;
    onContentChange: (val: string) => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
    onRemoveThread: () => void;
    textareaRef: (el: HTMLTextAreaElement | null) => void;
    showRemove: boolean;
}

function ThreadEditor({
    thread,
    isFirst,
    user,
    topic,
    setTopic,
    onContentChange,
    onImageChange,
    onRemoveImage,
    onRemoveThread,
    textareaRef,
    showRemove,
}: ThreadEditorProps) {
    const { scrollRef, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, style: dragStyle } = useDragScroll();

    return (
        <div className="flex gap-3">
            {/* Left Column: Avatar & Connector */}
            <div className="flex flex-col items-center">
                <Avatar
                    src={user?.picture}
                    alt={user?.name}
                    size={isFirst ? 'md' : 24}
                    className={cn('ring-1 ring-zinc-100 dark:ring-zinc-800 transition-all', !isFirst && 'ml-1')}
                />
                <div className={cn('w-0.5 grow bg-zinc-100 dark:bg-zinc-800 my-2 rounded-full min-h-[20px]')} />
            </div>

            {/* Right Column: Editor */}
            <div className="flex-1 flex flex-col gap-1 min-w-0 pt-1 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-[15px] text-zinc-900 dark:text-zinc-50 leading-none">
                            {user?.name || 'User'}
                        </div>
                        {isFirst && (
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
                        )}
                    </div>
                    {showRemove && !isFirst && (
                        <button
                            onClick={onRemoveThread}
                            className="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                            title="Remove from thread"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <textarea
                    ref={textareaRef}
                    autoFocus={isFirst}
                    placeholder={isFirst ? 'Start a thread...' : 'Add another...'}
                    className={cn(
                        'w-full bg-transparent border-none focus:ring-0 outline-none resize-none p-0 mt-2',
                        'text-[16px] sm:text-[18px] leading-[1.6] font-medium tracking-tight',
                        'text-zinc-900 dark:text-zinc-50',
                        'placeholder:text-zinc-400/70 dark:placeholder:text-zinc-600/70',
                        'min-h-[40px] transition-all duration-200',
                    )}
                    value={thread.content}
                    onChange={(e) => onContentChange(e.target.value)}
                />

                {/* Image Previews - Only for first post */}
                {isFirst && thread.previews.length > 0 && (
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
                            {thread.previews.map((preview, index) => (
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
                                        onClick={() => onRemoveImage(index)}
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

                {/* Media Actions - Only for first post */}
                {isFirst && (
                    <div className="flex items-center gap-4 mt-2">
                        <button
                            type="button"
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.multiple = true;
                                input.onchange = (e) =>
                                    onImageChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                                input.click();
                            }}
                            disabled={thread.images.length >= 2}
                            className={cn(
                                'p-1.5 -ml-1.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors',
                                'text-zinc-400 dark:text-zinc-600',
                                thread.images.length < 2 && 'hover:text-zinc-600 dark:hover:text-zinc-400',
                                thread.images.length >= 2 && 'opacity-30 cursor-not-allowed',
                            )}
                            title="Add photos (max 2)"
                        >
                            <ImageIcon size={20} strokeWidth={2} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
