import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, Settings, UserCircle } from 'lucide-react';
import Link from 'next/link';

function UserDropdown() {
    return (
        <>
            {/* User info (không click) */}
            <DropdownMenu.Label className="px-4 py-3">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">John Doe</p>
                <p className="text-sm text-zinc-500">john@example.com</p>
            </DropdownMenu.Label>

            <DropdownMenu.Separator className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Profile */}
            <DropdownMenu.Item asChild>
                <Link
                    href="/profile"
                    className="
                    flex items-center gap-2 px-4 py-2 text-sm
                    cursor-pointer outline-none
                    hover:bg-zinc-100 focus:bg-zinc-100
                    dark:hover:bg-zinc-800 dark:focus:bg-zinc-800
                "
                >
                    <UserCircle className="h-4 w-4" />
                    Profile
                </Link>
            </DropdownMenu.Item>

            {/* Settings */}
            <DropdownMenu.Item
                className="
                    flex items-center gap-2 px-4 py-2 text-sm
                    cursor-pointer outline-none
                    hover:bg-zinc-100 focus:bg-zinc-100
                    dark:hover:bg-zinc-800 dark:focus:bg-zinc-800
                "
            >
                <Settings className="h-4 w-4" />
                Settings
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Logout */}
            <DropdownMenu.Item
                className="
                    flex items-center gap-2 px-4 py-2 text-sm
                    cursor-pointer outline-none
                    text-red-600 dark:text-red-400
                    hover:bg-red-50 focus:bg-red-50
                    dark:hover:bg-red-950 dark:focus:bg-red-950
                "
            >
                <LogOut className="h-4 w-4" />
                Logout
            </DropdownMenu.Item>
        </>
    );
}

export default UserDropdown;
