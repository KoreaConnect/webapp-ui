'use client';

import { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: ReactNode;
}

export function Switch({ checked, onCheckedChange, disabled, label }: SwitchProps) {
    return (
        <label
            className={cn(
                'inline-flex items-center gap-2 cursor-pointer select-none',
                disabled && 'opacity-50 cursor-not-allowed',
            )}
        >
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => !disabled && onCheckedChange(e.target.checked)}
                    disabled={disabled}
                />
                <div
                    className={cn(
                        'block w-10 h-6 rounded-full transition-colors',
                        checked ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700',
                    )}
                ></div>
                <div
                    className={cn(
                        'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform',
                        checked ? 'transform translate-x-4' : '',
                    )}
                ></div>
            </div>
            {label && <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</span>}
        </label>
    );
}
