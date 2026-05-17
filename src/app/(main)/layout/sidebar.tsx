'use client';
import { useMessengerSidebar } from '@/context/messenger-sidebar-context';
import { useSidebar } from '@/context/sidebar-context';
import {
    Briefcase,
    Calendar,
    CarTaxiFront,
    HeartHandshake,
    Home,
    MapPin,
    Megaphone,
    MessageSquare,
    Package,
    Plane,
    Rss,
    ShoppingCart,
    Ticket,
    Truck,
    Users,
    Video,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CloseButton from '@/components/ui/close-button';
import { RovingItem } from '@/components/ui/roving-item';
import { RovingList } from '@/components/ui/roving-list';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { cn } from '@/utils';

const categories = [
    {
        name: 'Airport Ride Sharing',
        href: '/c/airport-ride-sharing',
        icon: Plane,
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
    const { closeMessengerSidebar } = useMessengerSidebar();

    const handleClickSidebarTab = () => {
        // Close sidebars on mobile when a link is clicked
        if (window.innerWidth < 768) {
            closeSidebar();
            closeMessengerSidebar();
        }
    };

    return (
        <>
            {/* Mobile Overlay (Backdrop) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/10 sm:hidden animate-overlay-fade-in 
                                z-(--global-sidebar-overlay-z-index)"
                    onClick={closeSidebar}
                />
            )}

            {/* Unified Aside Component */}
            <aside
                className={cn(
                    `fixed rounded-tr-2xl rounded-br-2xl top-0 h-full w-sidebar sm:w-(--small-sidebar-width) md:w-sidebar shrink-0 bg-background \
                    sm:block sm:left-auto sm:bg-white dark:sm:bg-black sm:translate-x-0  sm:top-header sm:rounded-none md:bg-transparent dark:md:bg-transparent\
                    z-(--global-sidebar-z-index) border-r border-border left-0 transition-transform duration-300 ease \
                    sm:z-0

            `,
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex h-full w-full flex-col">
                    {/* Mobile Close Button */}
                    <div className="sm:hidden flex justify-between items-center right-2 top-2 z-10 my-2 mx-3 mt-4">
                        <div className="w-8 h-8 bg-primary rounded-xl"></div>
                        <CloseButton onClick={toggleSidebar} />
                    </div>

                    {/* Scrollable Content */}

                    <ScrollableView vertical horizontal={false} className="flex-1 w-full">
                        <nav
                            className="flex flex-col gap-2 px-4 pb-20 pt-4 sm:px-2 md:px-4 sm:pt-6"
                            aria-label="Sidebar"
                        >
                            <RovingList>
                                <RovingItem>
                                    <Link
                                        href="/feed"
                                        onClick={handleClickSidebarTab}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                                                    transition-colors focus:outline-none focus:ring-1 focus:ring-primary sm:justify-center md:justify-start
                                                    ${pathname === '/feed' ? 'bg-accent font-bold' : 'text-zinc-600 hover:bg-accent/50'}
                                                `}
                                    >
                                        <Rss className="h-4 w-4" />
                                        <span className="text-sm font-medium tracking-tight sm:hidden md:block">
                                            Feed
                                        </span>
                                    </Link>
                                </RovingItem>

                                <RovingItem>
                                    <Link
                                        href="/community"
                                        onClick={handleClickSidebarTab}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                                                    transition-colors focus:outline-none focus:ring-1 focus:ring-primary sm:justify-center md:justify-start
                                                    ${pathname === '/community' ? 'bg-accent font-bold' : 'text-zinc-600 hover:bg-accent/50'}
                                                `}
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        <span className="text-sm font-medium tracking-tight sm:hidden md:block">
                                            Community
                                        </span>
                                    </Link>
                                </RovingItem>

                                <RovingItem>
                                    <Link
                                        href="/ome"
                                        onClick={handleClickSidebarTab}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                                                    transition-colors focus:outline-none focus:ring-1 focus:ring-primary sm:justify-center md:justify-start
                                                    ${pathname === '/ome' ? 'bg-accent font-bold' : 'text-zinc-600 hover:bg-accent/50'}
                                                `}
                                    >
                                        <Video className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm font-medium tracking-tight sm:hidden md:block">
                                            Ome Video
                                        </span>
                                    </Link>
                                </RovingItem>

                                <div className="flex items-center gap-2 my-4 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                    <span className="px-2 py-1 sm:hidden md:block">Categories</span>
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
                                                        transition-colors focus:outline-none focus:ring-1 focus:ring-primary sm:justify-center md:justify-start
                                                        ${isActive ? 'bg-accent font-bold' : 'text-zinc-600 hover:bg-accent/50'}
                                                        `}
                                            >
                                                <category.icon className="h-4 w-4" />
                                                <span className="text-sm font-medium tracking-tight sm:hidden md:block">
                                                    {category.name}
                                                </span>
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
