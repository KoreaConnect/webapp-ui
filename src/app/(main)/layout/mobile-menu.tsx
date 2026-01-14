'use client';

import { useSidebar } from '@/context/sidebar-context';
import { TextAlignJustify } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function MobileMenu() {
    const { toggleSidebar } = useSidebar();

    return (
        <Button className="block sm:hidden" variant="ghost" size="icon" onClick={toggleSidebar}>
            <TextAlignJustify className="h-6 w-6" />
        </Button>
    );
}
