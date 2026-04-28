'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { Post } from '@/types/post.type';
import { Flame, Heart, Plus, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import CreateThreadModal from '@/components/create-thread-modal';
import { ThreadCard } from '@/components/feed/thread-card';
import ReplyModal from '@/components/reply-modal';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/ui/dialog';
import { Loader } from '@/components/ui/loader';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { useDragScroll } from '@/hooks/use-drag-scroll';

import { postService } from '@/services';

import { getErrorMessage } from '@/utils/get-error-message';

// --- Mock Data ---

const USEFUL_THREADS = [
    {
        id: 1,
        title: 'How to find cheap flights to Korea',
        author: { name: 'TravelPro', avatar: 'https://i.pravatar.cc/150?u=1', username: 'travelpro' },
        category: 'Travel',
        likes: 120,
        icon: <Flame className="w-4 h-4 text-orange-500" />,
    },
    {
        id: 2,
        title: 'Top 10 restaurants in Seoul',
        author: { name: 'Foodie', avatar: 'https://i.pravatar.cc/150?u=2', username: 'foodie' },
        category: 'Food',
        likes: 85,
        icon: <Star className="w-4 h-4 text-yellow-500" />,
    },
    {
        id: 3,
        title: 'Visa application guide 2024',
        author: { name: 'GlobalNomad', avatar: 'https://i.pravatar.cc/150?u=3', username: 'nomad' },
        category: 'Guide',
        likes: 240,
        icon: <Zap className="w-4 h-4 text-blue-500" />,
    },
    {
        id: 4,
        title: 'Best co-working spaces in Gangnam',
        author: { name: 'WorkAnywhere', avatar: 'https://i.pravatar.cc/150?u=4', username: 'work' },
        category: 'Lifestyle',
        likes: 67,
        icon: <Flame className="w-4 h-4 text-orange-500" />,
    },
];

// --- Components ---

const UsefulThreadCard = ({ thread }: { thread: (typeof USEFUL_THREADS)[0] }) => {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push(`/feed/${thread.id}`)}
            className="flex-shrink-0 w-64 snap-start p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">{thread.icon}</div>
                <span className="text-xs font-bold text-zinc-500 uppercase">{thread.category}</span>
            </div>

            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 line-clamp-2 h-12">{thread.title}</h3>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar src={thread.author.avatar} size="xs" />
                    <span className="text-xs text-zinc-500">@{thread.author.username}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    {thread.likes}
                </div>
            </div>
        </div>
    );
};

// --- Page ---

export default function FeedPage() {
    const [open, setOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { show } = useToastStore();
    const {
        scrollRef: usefulThreadsRef,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,
        style: dragStyle,
    } = useDragScroll();

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await postService.getPosts();
            if (response.success) {
                setPosts(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            show({
                type: 'error',
                message: getErrorMessage(error, 'Failed to load posts'),
            });
        } finally {
            setIsLoading(false);
        }
    }, [show]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleCreateThread = async (data: { content: string; topic: string; images: File[] }) => {
        try {
            const payload = {
                posts: [
                    {
                        content: data.content,
                        topic: data.topic,
                        images: data.images,
                    },
                ],
            };

            const response = await postService.createThread(payload);

            if (response.success) {
                show({
                    type: 'success',
                    message: 'Thread created successfully!',
                });
                fetchPosts(); // Refresh feed
            } else {
                throw new Error(getErrorMessage(response.error, 'Failed to create thread'));
            }
        } catch (error) {
            show({
                type: 'error',
                message: getErrorMessage(error, 'Something went wrong'),
            });
            throw error;
        }
    };

    const handleReplyPost = async (data: { content: string; images: File[]; parent_id: string }) => {
        try {
            const response = await postService.replyPost(data);

            if (response.success) {
                show({
                    type: 'success',
                    message: 'Reply posted successfully!',
                });
                fetchPosts(); // Refresh feed to update counts
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
        e.preventDefault(); // Stop Link from navigating
        e.stopPropagation(); // Stop any other click handlers
        setSelectedPost(post);
        setIsReplyOpen(true);
    };

    return (
        <div className="max-w-full p-4">
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 flex justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md -mx-4 mb-2">
                <h1 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">Feed</h1>

                <DialogWrapper
                    open={open}
                    onOpenChange={setOpen}
                    trigger={
                        <Button className="rounded-full flex gap-2">
                            <Plus className="w-4 h-4" />
                            Post
                        </Button>
                    }
                >
                    <CreateThreadModal onPost={handleCreateThread} onClose={() => setOpen(false)} />
                </DialogWrapper>
            </div>

            {/* Useful Threads */}
            <div className="py-6">
                <div className="px-4 mb-4 flex justify-between">
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Useful Threads</h2>
                    <button className="text-xs text-primary font-semibold hover:underline">View All</button>
                </div>

                <div className="w-full px-4">
                    <ScrollableView
                        vertical={false}
                        horizontal
                        className="w-full  select-none"
                        ref={usefulThreadsRef}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseLeave}
                    >
                        <div className="flex flex-row gap-4 pb-4 max-w-0" style={dragStyle}>
                            {USEFUL_THREADS.map((thread) => (
                                <UsefulThreadCard key={thread.id} thread={thread} />
                            ))}
                        </div>
                    </ScrollableView>
                </div>
            </div>

            <div className="pb-20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader size="lg" />
                        <p className="text-zinc-500 text-sm animate-pulse">Loading your feed...</p>
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((thread) => (
                        <Link key={thread.id} href={`/feed/${thread.id}`} className="block">
                            <ThreadCard post={thread} onReplyClick={onReplyClick} />
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-20 text-zinc-500">
                        <p>No posts yet. Be the first to start a thread!</p>
                    </div>
                )}
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
