'use client';

import React, { useState } from 'react';

import { Flame, Heart, MessageCircle, MoreHorizontal, Plus, Share2, Star, Zap } from 'lucide-react';
import Image from 'next/image';

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/ui/dialog';
import { ScrollableView } from '@/components/ui/scrollable-view';
import WritePostDialogContent from '@/components/write-post-modal';

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
        content: 'Does anyone know the best way to get to Busan from Seoul? Should I take the KTX or a bus?',
        likes: 12,
        comments: 18,
        time: '4h ago',
    },
    {
        id: 3,
        author: { name: 'Park Ji-won', avatar: 'https://i.pravatar.cc/150?u=12', username: 'jiwon_p' },
        content: 'Finally tried the famous Gwangjang Market street food. The bindaetteok was 10/10! 🥞',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000&auto=format&fit=crop',
        likes: 56,
        comments: 12,
        time: '6h ago',
    },
];

// --- Sub-components ---

const UsefulThreadCard = ({ thread }: { thread: (typeof USEFUL_THREADS)[0] }) => (
    <div className="flex-shrink-0 w-64 p-4 mr-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">{thread.icon}</div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{thread.category}</span>
        </div>
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 line-clamp-2 h-12 leading-tight">
            {thread.title}
        </h3>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Avatar src={thread.author.avatar} size="xs" />
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">@{thread.author.username}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>{thread.likes}</span>
            </div>
        </div>
    </div>
);

const ThreadCard = ({ thread }: { thread: (typeof NORMAL_THREADS)[0] }) => (
    <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group">
        <div className="flex gap-3">
            <Avatar src={thread.author.avatar} size="md" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {thread.author.name}
                        </span>
                        <span className="text-sm text-zinc-500 truncate">@{thread.author.username}</span>
                        <span className="text-xs text-zinc-400">• {thread.time}</span>
                    </div>
                    <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <p className="text-zinc-800 dark:text-zinc-200 text-[15px] leading-normal mb-3 whitespace-pre-wrap">
                    {thread.content}
                </p>

                {thread.image && (
                    <div className="mb-3 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative aspect-video">
                        <Image src={thread.image} alt="Thread image" fill className="object-cover" unoptimized />
                    </div>
                )}

                <div className="flex items-center gap-6 text-zinc-500">
                    <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors group/btn">
                        <div className="p-2 group-hover/btn:bg-rose-50 dark:group-hover/btn:bg-rose-500/10 rounded-full">
                            <Heart className="w-5 h-5" />
                        </div>
                        <span className="text-sm">{thread.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors group/btn">
                        <div className="p-2 group-hover/btn:bg-blue-50 dark:group-hover/btn:bg-blue-500/10 rounded-full">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-sm">{thread.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors group/btn">
                        <div className="p-2 group-hover/btn:bg-green-50 dark:group-hover/btn:bg-green-500/10 rounded-full">
                            <Share2 className="w-5 h-5" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Page Component ---

export default function FeedPage() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const handlePostTypeSelect = (id: string) => {
        console.log('Selected post type:', id);
        setIsPostModalOpen(false);
        // Navigate to create post page or open another modal based on type
    };

    return (
        <ScrollableView className="bg-white dark:bg-zinc-950">
            {/* Header */}
            <div className="sticky top-0 z-10 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
                <div className="max-w-2xl mx-auto flex items-center justify-between p-4">
                    <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Feed</h1>
                    <DialogWrapper
                        open={isPostModalOpen}
                        onOpenChange={setIsPostModalOpen}
                        trigger={
                            <Button className="rounded-full shadow-lg shadow-primary/20 flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                <span className="font-bold">Post</span>
                            </Button>
                        }
                    >
                        <WritePostDialogContent onSelect={handlePostTypeSelect} />
                    </DialogWrapper>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                {/* Useful Threads Section */}
                <div className="py-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="px-4 mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Useful Threads</h2>
                        <button className="text-xs font-bold text-primary hover:underline">View All</button>
                    </div>
                    <div className="flex overflow-x-auto px-4 no-scrollbar pb-2">
                        {USEFUL_THREADS.map((thread) => (
                            <UsefulThreadCard key={thread.id} thread={thread} />
                        ))}
                    </div>
                </div>

                {/* Normal Threads Section */}
                <div className="pb-20">
                    {NORMAL_THREADS.map((thread) => (
                        <ThreadCard key={thread.id} thread={thread} />
                    ))}
                </div>
            </div>
        </ScrollableView>
    );
}
