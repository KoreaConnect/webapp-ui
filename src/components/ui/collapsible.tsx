'use client';

import * as React from 'react';

import { ChevronDown } from 'lucide-react';

import { cn } from '@/utils/cn';

interface CollapsibleProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    onOpen?: () => void;
    className?: string;
    badge?: string | number;
}

export function Collapsible({
    title,
    icon,
    children,
    defaultOpen = false,
    onOpen,
    className,
    badge,
}: CollapsibleProps) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    const handleToggle = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        if (nextState && onOpen) {
            onOpen();
        }
    };

    return (
        <div className={cn('border-b border-border/50 last:border-0', className)}>
            <button
                type="button"
                onClick={handleToggle}
                className="flex items-center justify-between w-full py-3 px-1 hover:bg-accent/50 hover:rounded-md transition-colors group"
            >
                <div className="flex items-center gap-2.5">
                    {icon && (
                        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                            {icon}
                        </div>
                    )}
                    <span className="text-sm font-semibold">{title}</span>
                    {badge !== undefined && (
                        <span className="text-[10px] bg-accent px-1.5 py-0.5 rounded-full text-muted-foreground font-medium">
                            {badge}
                        </span>
                    )}
                </div>
                <ChevronDown
                    className={cn(
                        'h-4 w-4 text-muted-foreground transition-transform duration-200',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>
            <div
                className={cn(
                    'grid transition-all duration-200 ease-in-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
            >
                <div className="overflow-hidden">
                    <div className="pb-3 px-1">{isOpen && children}</div>
                </div>
            </div>
        </div>
    );
}
