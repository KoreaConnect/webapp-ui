'use client';
import { useSidebar } from '@/context/sidebar-context';
import * as RovingFocus from '@radix-ui/react-roving-focus';
import {
    Briefcase,
    Calendar,
    CarTaxiFront,
    HeartHandshake,
    Home,
    MapPin,
    Megaphone,
    Package,
    Rss,
    ShoppingCart,
    Ticket,
    Truck,
    Users,
    X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { RovingItem } from '@/components/ui/roving-item';
import { RovingList } from '@/components/ui/roving-list';
import { ScrollableView } from '@/components/ui/scrollable-view';

const categories = [
    {
        name: 'Taxi Share',
        href: '/c/taxi-share',
        icon: CarTaxiFront,
    },
    {
        name: 'Carry Help',
        href: '/c/carry-help',
        icon: Truck,
    },
    {
        name: 'Home Transfer',
        href: '/c/home-transfer',
        icon: Ticket,
    },

    {
        name: 'Parcel Delivery',
        href: '/c/parcel-delivery',
        icon: Package,
    },
    {
        name: 'Roommate Finder',
        href: '/c/roommate-finder',
        icon: Users,
    },
    {
        name: 'House Renting',
        href: '/c/house-renting',
        icon: Home,
    },
    {
        name: 'Lost & Found',
        href: '/c/lost-found',
        icon: MapPin,
    },
    {
        name: 'Buy & Sell',
        href: '/c/buy-sell',
        icon: ShoppingCart,
    },
    {
        name: 'Job & Part-time',
        href: '/c/job-part-time',
        icon: Briefcase,
    },
    {
        name: 'Events & Meetups',
        href: '/c/events-meetups',
        icon: Calendar,
    },
    {
        name: 'Help & Support',
        href: '/c/help-support',
        icon: HeartHandshake,
    },
    {
        name: 'Announcements',
        href: '/c/announcements',
        icon: Megaphone,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, closeSidebar, toggleSidebar } = useSidebar();

    const handleClickSidebarTab = () => {
        // Close sidebar on mobile when a link is clicked
        if (window.innerWidth < 768) {
            closeSidebar();
        }
    };

    return (
        <>
            {/* Mobile Overlay (Backdrop) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/0 md:hidden animate-overlay-fade-in z-100"
                    onClick={closeSidebar}
                />
            )}

            {/* Unified Aside Component */}
            <aside
                className={`md:block md:left-auto md:bg-transparent md:translate-x-0 md:border-none
            fixed top-header h-full w-sidebar shrink-0 bg-background z-300 border-r border-border left-0 transition-transform duration-300 ease 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            >
                <div className="flex h-full flex-col">
                    {/* Mobile Close Button */}
                    <div className="md:hidden flex justify-end p-2 absolute right-2 top-2 z-10">
                        <Button onClick={toggleSidebar} variant="ghost" size="icon">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Scrollable Content */}

                    <ScrollableView vertical horizontal={false} className="flex-1">
                        <nav className="flex flex-col gap-2 px-4 pb-20 pt-12 md:pt-6" aria-label="Sidebar">
                            <RovingList>
                                <RovingItem>
                                    <Link
                                        href="/feed"
                                        onClick={handleClickSidebarTab}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                                                    transition-colors focus:outline-none focus:ring-1 focus:ring-primary
                                                    ${pathname === '/feed' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-zinc-50'}
                                                `}
                                    >
                                        <Rss className="h-6 w-6" />
                                        <span className="text-xl font-bold tracking-tight">Feed</span>
                                    </Link>
                                </RovingItem>

                                <div className="flex items-center gap-2 my-4 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                    Categories
                                    <span className="h-0.5 w-full bg-zinc-200 dark:bg-zinc-700"></span>
                                </div>
                                {categories.map((category) => {
                                    const isActive = pathname === category.href;
                                    return (
                                        <RovingItem key={category.href}>
                                            <Link
                                                href={category.href}
                                                onClick={handleClickSidebarTab}
                                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                                                        transition-colors focus:outline-none focus:ring-1 focus:ring-primary
                                                        ${isActive ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-zinc-50'}
                                                        `}
                                            >
                                                <category.icon className="h-4 w-4" />
                                                {category.name}
                                            </Link>
                                        </RovingItem>
                                    );
                                })}
                            </RovingList>
                        </nav>
                    </ScrollableView>
                </div>
            </aside>
        </>
    );
}
