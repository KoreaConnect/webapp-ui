'use client';

import { useState } from 'react';

import {
    ArrowLeft,
    Calendar,
    Heart,
    Link as LinkIcon,
    MapPin,
    MessageSquare,
    MoreHorizontal,
    Repeat2,
    Share,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header / Nav */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-6">
                <Link
                    href="/feed"
                    className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex flex-col">
                    <h2 className="font-bold text-lg leading-5">John Doe</h2>
                    <span className="text-xs text-muted-foreground">1,234 posts</span>
                </div>
            </div>

            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 w-full relative">
                {/* Placeholder for cover image */}
            </div>

            {/* Profile Info Section */}
            <div className="px-4 relative mb-4">
                <div className="flex justify-between items-start">
                    {/* Avatar - Negative margin to overlap cover */}
                    <div className="-mt-16 relative">
                        <div className="w-32 h-32 rounded-full border-4 border-background bg-zinc-200 overflow-hidden">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <button className="mt-4 px-4 py-1.5 border border-zinc-300 dark:border-zinc-700 font-semibold rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        Edit Profile
                    </button>
                </div>

                <div className="mt-3">
                    <h1 className="font-bold text-xl leading-6">John Doe</h1>
                    <p className="text-muted-foreground">@johndoe</p>
                </div>

                <div className="mt-4 space-y-3">
                    <p className="whitespace-pre-wrap">
                        Software Engineer 👨‍💻 | Building cool things for the web 🌐 | Coffee lover ☕
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>San Francisco, CA</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <LinkIcon className="w-4 h-4" />
                            <a href="#" className="text-blue-500 hover:underline">
                                johndoe.com
                            </a>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined September 2018</span>
                        </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                        <div className="hover:underline cursor-pointer">
                            <span className="font-bold text-foreground">567</span>{' '}
                            <span className="text-muted-foreground">Following</span>
                        </div>
                        <div className="hover:underline cursor-pointer">
                            <span className="font-bold text-foreground">8.9K</span>{' '}
                            <span className="text-muted-foreground">Followers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mt-2">
                {['Posts', 'Replies', 'Highlights', 'Media', 'Likes'].map((tab) => {
                    const id = tab.toLowerCase();
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 py-4 text-sm font-medium transition-colors relative
                 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                            {tab}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full w-16 mx-auto" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1">
                {/* Mock Post 1 */}
                <PostItem
                    name="John Doe"
                    handle="@johndoe"
                    time="2h"
                    content="Just shipped a new feature! 🚀 detailed analytics are now available for all pro users. Check it out and let me know what you think!"
                    likes={245}
                    comments={12}
                    retweets={5}
                    views="1.2k"
                />

                {/* Mock Post 2 */}
                <PostItem
                    name="John Doe"
                    handle="@johndoe"
                    time="5h"
                    content="The sunset today was absolutely stunning. Sometimes you just have to stop and appreciate the little things."
                    image="https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=2832&auto=format&fit=crop"
                    likes={892}
                    comments={45}
                    retweets={89}
                    views="5.4k"
                />

                {/* Mock Post 3 */}
                <PostItem
                    name="John Doe"
                    handle="@johndoe"
                    time="1d"
                    content="Working on some new UI components. Tailwind CSS makes it so easy to build beautiful interfaces quickly."
                    likes={134}
                    comments={8}
                    retweets={2}
                    views="800"
                />
            </div>
        </div>
    );
}

function PostItem({
    name,
    handle,
    time,
    content,
    image,
    likes,
    comments,
    retweets,
    views,
}: {
    name: string;
    handle: string;
    time: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    retweets: number;
    views: string;
}) {
    return (
        <article className="border-b border-border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer">
            <div className="flex gap-3">
                <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm truncate">
                            <span className="font-bold truncate">{name}</span>
                            <span className="text-muted-foreground truncate">{handle}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{time}</span>
                        </div>
                        <button className="text-muted-foreground hover:text-blue-500 rounded-full p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-sm mt-1 whitespace-pre-wrap">{content}</p>

                    {image && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-border">
                            <img src={image} alt="Post content" className="w-full h-auto" />
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-3 text-muted-foreground max-w-md">
                        <button className="flex items-center gap-2 group text-sm hover:text-blue-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <span className="text-xs">{comments}</span>
                        </button>

                        <button className="flex items-center gap-2 group text-sm hover:text-green-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                                <Repeat2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs">{retweets}</span>
                        </button>

                        <button className="flex items-center gap-2 group text-sm hover:text-pink-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20">
                                <Heart className="w-4 h-4" />
                            </div>
                            <span className="text-xs">{likes}</span>
                        </button>

                        <button className="flex items-center gap-2 group text-sm hover:text-blue-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                                <Share className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
