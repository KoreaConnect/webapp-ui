'use client';

import { Play, ShieldAlert, SkipForward, Square } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { OmeStatus } from '@/hooks/use-ome-session';

import { cn } from '@/utils';

interface OmeControlsProps {
    status: OmeStatus;
    onStart: () => void;
    onStop: () => void;
    onNext: () => void;
}

export const OmeControls = ({ status, onStart, onStop, onNext }: OmeControlsProps) => {
    const isIdle = status === 'idle';
    const isSearching = status === 'searching';
    const isConnected = status === 'connected';

    return (
        <div className="flex w-full items-center justify-between gap-4">
            <div className="flex gap-3">
                {isIdle ? (
                    <Button
                        onClick={onStart}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        START
                    </Button>
                ) : (
                    <Button
                        onClick={onStop}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        <Square className="mr-2 h-5 w-5 fill-current" />
                        STOP
                    </Button>
                )}

                {(isSearching || isConnected) && (
                    <Button
                        onClick={onNext}
                        variant="secondary"
                        className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-8 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 border border-border dark:border-transparent"
                    >
                        <SkipForward className="mr-2 h-5 w-5 fill-current" />
                        NEXT
                    </Button>
                )}
            </div>

            {isConnected && (
                <Button variant="ghost" className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl p-4">
                    <ShieldAlert className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
};
