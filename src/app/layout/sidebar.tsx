'use client';

import { CarTaxiFront, Rss, Ticket, Truck, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSidebar } from './sidebar-context';

const categories = [
    {
        name: 'Feed',
        href: '/feed',
        icon: Rss,
    },
    {
        name: 'Taxi Share',
        href: '/taxi-share',
        icon: CarTaxiFront,
    },
    {
        name: 'Staff Delivery',
        href: '/staff-delivery',
        icon: Truck,
    },
    {
        name: 'Home Pass',
        href: '/home-pass',
        icon: Ticket,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isOpen, isCollapsed, toggleSidebar } = useSidebar();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={toggleSidebar} />}

            {/* Sidebar */}
            <aside
                className={`
                fixed sm:relative z-50 w-64 flex-col border-r border-border bg-background py-6
                ${isOpen ? 'flex' : 'hidden'}
                ${isCollapsed ? 'sm:hidden' : 'sm:flex'}
                ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
                transition-transform duration-200 ease-in-out
            `}
            >
                {/* Mobile close button */}
                <div className="flex items-center justify-between px-4 mb-4 sm:hidden">
                    <span className="text-lg font-semibold">Menu</span>
                    <button
                        onClick={toggleSidebar}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <nav className="flex flex-col gap-2 px-4">
                    <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Categories
                    </div>
                    {categories.map((category) => {
                        const isActive = pathname === category.href;
                        return (
                            <Link
                                key={category.href}
                                href={category.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white'
                                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                                }`}
                            >
                                <category.icon className="h-4 w-4" />
                                {category.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
