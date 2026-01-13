'use client';

import { Bell, Menu, Plus, Search, User } from 'lucide-react';
import Link from 'next/link';

import { useSidebar } from './sidebar-context';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md dark:bg-black/80">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left side: Menu, Logo, Search bar */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <div className="h-8 w-8 rounded-lg bg-black dark:bg-white" />
                        <span className="text-xl font-bold tracking-tight text-black dark:text-white">KOCO</span>
                    </Link>
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-9 w-64 rounded-full border border-border bg-zinc-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:bg-zinc-900 dark:focus:ring-white"
                        />
                    </div>
                </div>

                {/* Right side: Addition, Notification, User */}
                <div className="flex items-center gap-2">
                    <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <Plus className="h-5 w-5" />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <Bell className="h-5 w-5" />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <User className="h-5 w-5" />
                    </button>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
