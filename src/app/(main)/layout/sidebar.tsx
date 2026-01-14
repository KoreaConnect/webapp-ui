'use client';

import { useSidebar } from '@/context/sidebar-context';
import { CarTaxiFront, Rss, Ticket, Truck, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

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
    const { closeSidebar } = useSidebar();
    const handleClickSidebarTab = () => {
        closeSidebar();
    };

    return (
        <nav className="flex flex-col gap-2 px-4">
            <Link
                href="/feed"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/feed'
                        ? 'bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
                onClick={handleClickSidebarTab}
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
                        href={category.href}
                        onClick={handleClickSidebarTab}
                        key={category.href}
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

export function MobileSideBar() {
    const { isSidebarOpen, toggleSidebar } = useSidebar();

    return (
        <div
            className={`
                fixed top-16 bottom-0 left-0 z-50 md:hidden
                w-sidebar bg-gray-200 border-t border-border
                py-2 
                transform transition-transform duration-200 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
        >
            <Button onClick={toggleSidebar} className="fixed right-2 top-2" variant="ghost" size="icon">
                <X />
            </Button>
            <div className="h-full overflow-auto pt-10">
                <Sidebar />
            </div>
        </div>
    );
}
