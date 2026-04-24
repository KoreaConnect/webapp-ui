'use client';

import React, { useState } from 'react';

import { Flame, Heart, MessageCircle, MoreHorizontal, Plus, Share2, Star, Zap } from 'lucide-react';
import Image from 'next/image';

import CreateThreadModal from '@/components/create-thread-modal';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/ui/dialog';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { useDragScroll } from '@/hooks/use-drag-scroll';

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

const NORMAL_THREADS = [
    {
        id: 1,
        author: { name: 'Kim Min-su', avatar: 'https://i.pravatar.cc/150?u=10', username: 'minsu_k' },
        content:
            'Just arrived in Incheon! The weather is amazing today. Anyone up for a coffee in Hongdae later? ☕️ #Seoul #Travel',
        image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000&auto=format&fit=crop',
        likes: 24,
        comments: 5,
        time: '2h ago',
    },
    {
        id: 2,
        author: { name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=11', username: 'sarah_w' },
        content: 'Does anyone know the best way to get to Busan from Seoul?',
        likes: 12,
        comments: 18,
        time: '4h ago',
    },
];

// --- Components ---

const UsefulThreadCard = ({ thread }: { thread: (typeof USEFUL_THREADS)[0] }) => (
    <div className="flex-shrink-0 w-64 snap-start p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer">
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

const ThreadCard = ({ thread }: { thread: (typeof NORMAL_THREADS)[0] }) => (
    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex gap-3">
            <Avatar src={thread.author.avatar} size="md" />

            <div className="flex-1">
                <div className="flex justify-between mb-1">
                    <div className="flex gap-2 text-sm">
                        <span className="font-bold">{thread.author.name}</span>
                        <span className="text-zinc-500">@{thread.author.username}</span>
                        <span className="text-zinc-400">{thread.time}</span>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                </div>

                <p className="mb-3">{thread.content}</p>

                {thread.image && (
                    <div className="rounded-xl overflow-hidden mb-3 relative aspect-video">
                        <Image src={thread.image} alt="" fill className="object-cover" />
                    </div>
                )}

                <div className="flex gap-6 text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {thread.likes}
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {thread.comments}
                    </div>
                    <Share2 className="w-4 h-4" />
                </div>
            </div>
        </div>
    </div>
);

// --- Page ---

export default function FeedPage() {
    const [open, setOpen] = useState(false);
    const {
        scrollRef: usefulThreadsRef,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,
        style: dragStyle,
    } = useDragScroll();

    return (
        <div className="max-w-full h-full overflow-hidden p-4">
            <ScrollableView>
                {/* Header */}
                <div className="sticky top-0 z-10  p-4 flex justify-between">
                    <h1 className="font-bold text-2xl">Feed</h1>

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
                        <CreateThreadModal onClose={() => setOpen(false)} />
                    </DialogWrapper>
                </div>

                {/* Useful Threads */}
                <div className="py-6">
                    <div className="px-4 mb-4 flex justify-between">
                        <h2 className="text-sm font-bold text-zinc-400">Useful Threads</h2>
                        <button className="text-xs text-primary">View All</button>
                    </div>

                    <div className="w-full ">
                        <ScrollableView
                            vertical={false}
                            horizontal
                            className="w-full px-4 select-none"
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
                    {NORMAL_THREADS.map((thread) => (
                        <ThreadCard key={thread.id} thread={thread} />
                    ))}
                </div>
            </ScrollableView>
        </div>
    );
}
