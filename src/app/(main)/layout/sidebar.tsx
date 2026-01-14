'use client';

import { CarTaxiFront, Rss, Ticket, Truck, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories = [
    {
        name: 'Taxi Share',
        href: '/c/taxi-share',
        icon: CarTaxiFront,
    },
    {
        name: 'Staff Delivery',
        href: '/c/staff-delivery',
        icon: Truck,
    },
    {
        name: 'Home Pass',
        href: '/c/home-pass',
        icon: Ticket,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2 px-4">
            <Link
                href="/feed"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/feed'
                        ? 'bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
            >
                <Rss className="h-6 w-6" />
                <span className="text-xl font-bold tracking-tight text-black dark:text-white">Feed</span>
            </Link>
            <div className="flex items-center gap-2 my-4 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Categories
                <span className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-700"></span>
            </div>
            {categories.map((category) => {
                const isActive = pathname === category.href;
                return (
                    <Link
                        key={category.href}
                        href={category.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                                ? 'bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white'
                                : 'text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                        }`}
                    >
                        <category.icon className="h-4 w-4" />
                        {category.name}
                    </Link>
                );
            })}
        </nav>
    );
}
