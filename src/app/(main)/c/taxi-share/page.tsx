'use client';

import { useState } from 'react';

import { Calendar, Clock, Filter, MapPin, Plus, Search, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';

const MOCK_POSTS = [
    {
        id: 1,
        user: {
            name: 'Alex Johnson',
            avatar: 'https://i.pravatar.cc/150?u=alex',
        },
        from: 'Downtown',
        to: 'Airport',
        date: '2026-01-21',
        time: '14:30',
        seats: 3,
        seatsFilled: 1,
        price: '150,000₫',
        status: 'open',
    },
    {
        id: 2,
        user: {
            name: 'Sarah Smith',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
        },
        from: 'Tech Hub',
        to: 'West Side',
        date: '2026-01-21',
        time: '16:00',
        seats: 4,
        seatsFilled: 2,
        price: '100,000₫',
        status: 'open',
    },
    {
        id: 3,
        user: {
            name: 'Michael Chen',
            avatar: 'https://i.pravatar.cc/150?u=michael',
        },
        from: 'Grand Central',
        to: 'Brooklyn Heights',
        date: '2026-01-22',
        time: '09:00',
        seats: 3,
        seatsFilled: 0,
        price: '200,000₫',
        status: 'open',
    },
    {
        id: 4,
        user: {
            name: 'Alex Johnson',
            avatar: 'https://i.pravatar.cc/150?u=alex',
        },
        from: 'Downtown',
        to: 'Airport',
        date: '2026-01-21',
        time: '14:30',
        seats: 3,
        seatsFilled: 1,
        price: '150,000₫',
        status: 'open',
    },
    {
        id: 5,
        user: {
            name: 'Sarah Smith',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
        },
        from: 'Tech Hub',
        to: 'West Side',
        date: '2026-01-21',
        time: '16:00',
        seats: 4,
        seatsFilled: 2,
        price: '100,000₫',
        status: 'open',
    },
    {
        id: 6,
        user: {
            name: 'Michael Chen',
            avatar: 'https://i.pravatar.cc/150?u=michael',
        },
        from: 'Grand Central',
        to: 'Brooklyn Heights',
        date: '2026-01-22',
        time: '09:00',
        seats: 3,
        seatsFilled: 0,
        price: '200,000₫',
        status: 'open',
    },
];

export default function TaxiSharePage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="mx-auto w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Taxi Share</h1>
                    <p className="text-zinc-500 mt-1">Find people to share a ride with and save costs.</p>
                </div>
                <Button className="w-full md:w-auto shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4 mr-2" />
                    New Ride
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="From"
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="To"
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="date"
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                        />
                    </div>
                    <Button variant="default" className="w-full h-11">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Available Rides</h2>
                    <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-foreground">
                        <Filter className="h-4 w-4 mr-2" />
                        Sort by: Latest
                    </Button>
                </div>

                <div className="grid gap-4">
                    {MOCK_POSTS.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border hover:border-primary/30 transition-all cursor-pointer group hover:shadow-md"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* User Info */}
                                <div className="flex items-center md:flex-col md:items-start md:w-32 gap-3 shrink-0">
                                    <div className="relative">
                                        <img
                                            src={post.user.avatar}
                                            alt={post.user.name}
                                            className="h-12 w-12 md:h-14 md:w-14 rounded-2xl object-cover border-2 border-white dark:border-zinc-800 shadow-sm"
                                        />
                                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white dark:border-zinc-800 rounded-full" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                                            {post.user.name}
                                        </span>
                                        <span className="text-xs text-zinc-500 font-medium">Verified Driver</span>
                                    </div>
                                </div>

                                {/* Ride Details */}
                                <div className="flex-1 flex flex-col gap-5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center gap-1.5 shrink-0 py-1">
                                            <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                                            <div className="w-0.5 h-8 bg-dashed bg-zinc-200 dark:bg-zinc-800" />
                                            <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-white dark:bg-zinc-900" />
                                        </div>
                                        <div className="flex flex-col justify-between h-16">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">
                                                    Pickup
                                                </span>
                                                <span className="font-bold text-lg leading-tight">{post.from}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">
                                                    Dropoff
                                                </span>
                                                <span className="font-bold text-lg leading-tight">{post.to}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{post.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{post.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                                            <Users className="h-4 w-4 text-primary" />
                                            <span className="font-medium">
                                                {post.seatsFilled}/{post.seats} Seats Filled
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                                    <div className="text-left md:text-right">
                                        <div className="text-3xl font-black text-primary tracking-tight">
                                            {post.price}
                                        </div>
                                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                            per person
                                        </span>
                                    </div>
                                    <Button
                                        variant="default"
                                        className="rounded-2xl px-6 group-hover:scale-105 transition-transform"
                                    >
                                        Join Ride
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
