'use client';

import { useEffect, useRef } from 'react';

import { User, VideoOff } from 'lucide-react';

import { cn } from '@/utils';

interface VideoPanelProps {
    stream: MediaStream | null;
    isLocal?: boolean;
    label?: string;
    isSearching?: boolean;
}

export const VideoPanel = ({ stream, isLocal, label, isSearching }: VideoPanelProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 shadow-2xl ring-1 ring-border">
            {stream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    className={cn('h-full w-full object-cover bg-zinc-900', isLocal && 'scale-x-[-1]')}
                />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center space-y-4 bg-zinc-100 dark:bg-zinc-900">
                    <div
                        className={cn('rounded-full bg-zinc-200 dark:bg-zinc-800 p-6', isSearching && 'animate-pulse')}
                    >
                        {isSearching ? (
                            <User className="h-12 w-12 text-zinc-400 dark:text-zinc-500" />
                        ) : (
                            <VideoOff className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
                        )}
                    </div>
                    <p className="text-sm font-medium text-zinc-500">{isSearching ? 'Searching...' : 'Video Off'}</p>
                </div>
            )}

            {label && (
                <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {label}
                </div>
            )}

            {isSearching && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent animate-pulse" />
                </div>
            )}
        </div>
    );
};
