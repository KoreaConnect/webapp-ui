import { X } from 'lucide-react';

import { cn } from '@/utils';

type CloseButtonProps = {
    size?: 'sm' | 'md' | 'lg';
    sizePx?: number; // custom size
    onClick?: () => void;
    className?: string;
};

const sizeMap = {
    sm: 28,
    md: 36,
    lg: 44,
};

export default function CloseButton({ size = 'md', sizePx, onClick, className }: CloseButtonProps) {
    const finalSize = sizePx ?? sizeMap[size];
    const iconSize = finalSize * 0.5;

    return (
        <button
            onClick={onClick}
            style={{
                width: finalSize,
                height: finalSize,
            }}
            className={cn(
                'flex items-center justify-center rounded-xl',
                'transition-all duration-200',
                'hover:bg-gray-200 dark:hover:bg-gray-700',
                // 'active:scale-95 hover:scale-105',
                'focus:outline-none focus:ring-1 focus:ring-gray-400',
                className,
            )}
        >
            <X size={iconSize} strokeWidth={2.5} />
        </button>
    );
}
