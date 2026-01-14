'use client';

import { useSidebar } from '@/context/sidebar-context';
import { useAuthStore } from '@/store/use-auth-store';
import { Bell, Pen, Search, TextAlignJustify, User } from 'lucide-react';
import Link from 'next/link';

import NotificationDropdown from '@/components/notification-dropdown';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import UserDropdown from '@/components/user-dropdown';

const LoggedInHeader = () => {
    return (
        <>
            <Button className="w-9 h-9 !px-0 sm:w-auto sm:!px-4">
                <Pen className="h-4 w-4" />
                <span className="hidden sm:inline">Write</span>
            </Button>
            <Dropdown
                trigger={
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                }
                align="end"
            >
                <NotificationDropdown />
            </Dropdown>

            <Dropdown
                trigger={
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                    </Button>
                }
                align="end"
            >
                <UserDropdown />
            </Dropdown>
        </>
    );
};

const UnLoggedInHeader = () => {
    const { login } = useAuthStore();
    const handleLogin = () => {
        login({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
        });
    };
    return (
        <>
            <Button variant="ghost" className="font-extrabold" onClick={handleLogin}>
                Sign In
            </Button>
            <Button>Sign Up</Button>
        </>
    );
};

export default function Header() {
    const { isAuthenticated } = useAuthStore();
    const { toggleSidebar } = useSidebar();

    return (
        <header className="sticky h-header top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md dark:bg-black/80">
            <div className="mx-auto flex h-header items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left side: Menu, Logo, Search bar */}
                <div className="flex items-center gap-4">
                    <Button className="block md:hidden" variant="ghost" size="icon" onClick={toggleSidebar}>
                        <TextAlignJustify className="h-6 w-6" />
                    </Button>
                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <div className="h-8 w-8 rounded-lg bg-primary dark:bg-white" />
                        <span className="text-xl font-bold tracking-tight text-primary dark:text-white">KOCO</span>
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

                {/* Right side: Auth dependent buttons */}
                <div className="flex items-center gap-2">
                    {isAuthenticated ? <LoggedInHeader /> : <UnLoggedInHeader />}
                </div>
            </div>
        </header>
    );
}
