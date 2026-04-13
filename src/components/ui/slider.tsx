'use client';

import * as React from 'react';

import { cn } from '@/utils/cn';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    label?: string;
    valueLabel?: string;
    value: number;
    onValueChange?: (value: number) => void;
    onValueCommit?: (value: number) => void;
}

export function Slider({
    className,
    label,
    valueLabel,
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    value,
    ...props
}: SliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        onValueChange?.(newValue);
    };

    const handlePointerUp = () => {
        onValueCommit?.(value);
    };

    const percentage = ((value - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
        <div className={cn('space-y-3 w-full', className)}>
            {(label || valueLabel) && (
                <div className="flex items-center justify-between px-1">
                    {label && (
                        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
                    )}
                    {valueLabel && (
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                            {valueLabel}
                        </span>
                    )}
                </div>
            )}
            <div className="relative flex items-center h-5 group">
                {/* Track Background */}
                <div className="absolute w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full" />

                {/* Active Track */}
                <div className="absolute h-1.5 bg-primary rounded-full" style={{ width: `${percentage}%` }} />

                {/* Native Range Input (Hidden visual, handles interaction) */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    onPointerUp={handlePointerUp}
                    className={cn(
                        'absolute w-full h-1.5 opacity-0 cursor-pointer z-20',
                        'appearance-none bg-transparent',
                    )}
                    {...props}
                />

                {/* Custom Thumb */}
                <div
                    className="absolute h-4 w-4 bg-white border-2 border-primary rounded-full shadow-md z-10 pointer-events-none transition-transform duration-200 group-hover:scale-110 group-active:scale-125"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                />
            </div>
        </div>
    );
}
