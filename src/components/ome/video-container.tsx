'use client';

import { useEffect, useRef, useState } from 'react';

import { Layout, User } from 'lucide-react';

import { cn } from '@/utils';

interface VideoContainerProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isSearching?: boolean;
    partnerName?: string;
    chatMode?: 'video' | 'voice';
}

type LayoutMode = 'pip' | 'swapped' | 'grid';

export const VideoContainer = ({
    localStream,
    remoteStream,
    isSearching,
    partnerName,
    chatMode = 'video',
}: VideoContainerProps) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [layoutMode, setLayoutMode] = useState<LayoutMode>('pip');

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const cycleLayout = () => {
        const modes: LayoutMode[] = ['pip', 'swapped', 'grid'];
        const currentIndex = modes.indexOf(layoutMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setLayoutMode(modes[nextIndex]);
    };

    return (
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-accent shadow-2xl ring-1 ring-border transition-all duration-500">
            <div
                className={cn(
                    'grid h-full w-full transition-all duration-500 gap-2 p-2',
                    layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1',
                )}
            >
                {/* Remote Video Container */}
                <div
                    className={cn(
                        'relative overflow-hidden rounded-2xl bg-background/40 transition-all duration-500',
                        layoutMode === 'pip' && 'absolute inset-0 z-0',
                        layoutMode === 'swapped' &&
                            'absolute bottom-6 right-6 z-10 h-32 w-48 ring-1 ring-border shadow-xl lg:h-40 lg:w-60',
                        layoutMode === 'grid' && 'h-full w-full',
                    )}
                >
                    <div className="flex h-full w-full items-center justify-center">
                        {remoteStream && chatMode === 'video' ? (
                            <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-4 opacity-40">
                                <div
                                    className={cn(
                                        'flex h-20 w-20 items-center justify-center rounded-full bg-background backdrop-blur-xl ring-1 ring-border',
                                        isSearching && 'animate-pulse',
                                    )}
                                >
                                    <User className="h-10 w-10" />
                                </div>
                                {isSearching ? (
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-foreground">Finding match...</p>
                                    </div>
                                ) : (
                                    <p className="text-xs font-medium">No partner</p>
                                )}
                            </div>
                        )}
                    </div>
                    {layoutMode !== 'pip' && (
                        <div className="absolute bottom-2 left-2 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm uppercase">
                            Partner
                        </div>
                    )}
                </div>

                {/* Local Video Container */}
                <div
                    className={cn(
                        'relative overflow-hidden rounded-2xl bg-background/40 transition-all duration-500',
                        layoutMode === 'pip' &&
                            'absolute bottom-6 right-6 z-10 h-32 w-48 ring-1 ring-border shadow-xl lg:h-40 lg:w-60',
                        layoutMode === 'swapped' && 'absolute inset-0 z-0',
                        layoutMode === 'grid' && 'h-full w-full',
                    )}
                >
                    {localStream && chatMode === 'video' ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-full w-full object-cover scale-x-[-1]"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center opacity-30">
                            <User className="h-8 w-8" />
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm uppercase">
                        You
                    </div>
                </div>
            </div>

            {/* Layout Toggle Button */}
            {!isSearching && (remoteStream || localStream) && (
                <button
                    onClick={cycleLayout}
                    className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 text-foreground backdrop-blur-xl ring-1 ring-border shadow-lg transition-all hover:bg-background/80 hover:scale-105 active:scale-95"
                    title="Change Layout"
                >
                    <Layout className="h-5 w-5" />
                </button>
            )}

            {/* Partner Info Overlay */}
            {partnerName && !isSearching && layoutMode === 'pip' && (
                <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div className="rounded-2xl bg-background/60 px-4 py-2 backdrop-blur-xl ring-1 ring-border shadow-lg">
                        <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Connected with</p>
                        <p className="text-lg font-black text-primary uppercase tracking-tighter">{partnerName}</p>
                    </div>
                </div>
            )}

            {/* Scanning Effect for searching */}
            {isSearching && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent animate-pulse" />
                </div>
            )}
        </div>
    );
};
