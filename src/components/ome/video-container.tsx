'use client';

import { useEffect, useRef, useState } from 'react';

import { Layout, MapPin, Maximize, Minimize, User } from 'lucide-react';

import { cn } from '@/utils';

interface VideoContainerProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isSearching?: boolean;
    partnerName?: string;
    chatMode?: 'video' | 'voice';
    children?: React.ReactNode;
}

type LayoutMode = 'pip' | 'swapped' | 'grid';

export const VideoContainer = ({
    localStream,
    remoteStream,
    isSearching,
    partnerName,
    chatMode = 'video',
    children,
}: VideoContainerProps) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [layoutMode, setLayoutMode] = useState<LayoutMode>('pip');
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

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

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const cycleLayout = () => {
        const modes: LayoutMode[] = ['pip', 'swapped', 'grid'];
        const currentIndex = modes.indexOf(layoutMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setLayoutMode(modes[nextIndex]);
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative h-full w-full overflow-hidden bg-accent shadow-2xl ring-1 ring-border transition-all duration-500',
                isFullscreen ? 'rounded-none' : 'rounded-3xl',
            )}
        >
            <div
                className={cn(
                    'grid h-full w-full transition-all duration-500 gap-2 p-2',
                    layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1',
                )}
            >
                {/* Remote Video Container */}
                <div
                    onClick={() => layoutMode === 'swapped' && setLayoutMode('pip')}
                    className={cn(
                        'relative overflow-hidden rounded-2xl bg-background/40 transition-all duration-500',
                        layoutMode === 'pip' && 'absolute inset-0 z-0',
                        layoutMode === 'swapped' &&
                            'absolute top-24 right-6 z-10 h-32 w-48 ring-1 ring-border shadow-xl lg:h-40 lg:w-60 cursor-pointer hover:scale-105 active:scale-95',
                        layoutMode === 'grid' && 'h-full w-full',
                    )}
                >
                    <div className="flex h-full w-full items-center justify-center pointer-events-none">
                        {remoteStream && chatMode === 'video' ? (
                            <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-contain" />
                        ) : (
                            <div
                                className={cn(
                                    'flex flex-col items-center gap-8 transition-all duration-500',
                                    layoutMode === 'swapped' && 'gap-3',
                                )}
                            >
                                {isSearching ? (
                                    <div
                                        className={cn(
                                            'relative flex items-center justify-center transition-all duration-500',
                                            layoutMode === 'swapped' && 'scale-[0.45]',
                                        )}
                                    >
                                        {/* Radar Effect */}
                                        <div className="absolute h-64 w-64 rounded-full border border-primary/20" />
                                        <div className="absolute h-48 w-48 rounded-full border border-primary/10" />
                                        <div className="absolute h-32 w-32 rounded-full border border-primary/5" />

                                        {/* Spinning Radar Line */}
                                        <div className="absolute h-64 w-64 rounded-full animate-[spin_4s_linear_infinite]">
                                            <div className="h-1/2 w-1 bg-gradient-to-t from-primary to-transparent blur-[1px] mx-auto rounded-full origin-bottom" />
                                        </div>

                                        {/* Pulse Rings */}
                                        <div className="absolute h-24 w-24 rounded-full bg-primary/20 animate-ping opacity-20" />

                                        {/* Center Avatar */}
                                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-background/80 backdrop-blur-2xl ring-2 ring-primary/30 shadow-[0_0_40px_rgba(232,60,145,0.2)]">
                                            <User className="h-10 w-10 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={cn(
                                            'flex items-center justify-center rounded-full bg-background/40 backdrop-blur-xl ring-1 ring-border opacity-40 transition-all duration-500',
                                            layoutMode === 'swapped' ? 'h-12 w-12' : 'h-20 w-20',
                                        )}
                                    >
                                        <User
                                            className={cn(
                                                'transition-all duration-500',
                                                layoutMode === 'swapped' ? 'h-6 w-6' : 'h-10 w-10',
                                            )}
                                        />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        'text-center space-y-2 transition-all duration-500',
                                        isSearching
                                            ? layoutMode === 'swapped'
                                                ? 'translate-y-0'
                                                : 'translate-y-4'
                                            : 'opacity-40',
                                    )}
                                >
                                    {isSearching ? (
                                        <>
                                            <h3
                                                className={cn(
                                                    'font-black text-foreground uppercase tracking-tighter animate-pulse transition-all duration-500',
                                                    layoutMode === 'swapped' ? 'text-xs' : 'text-2xl',
                                                )}
                                            >
                                                Finding Match
                                                <span className="inline-flex w-8 justify-start">
                                                    <span className="animate-[bounce_1.5s_infinite]">.</span>
                                                    <span className="animate-[bounce_1.5s_0.2s_infinite]">.</span>
                                                    <span className="animate-[bounce_1.5s_0.4s_infinite]">.</span>
                                                </span>
                                            </h3>
                                            {layoutMode !== 'swapped' && (
                                                <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-xs font-black uppercase tracking-widest">
                                                        Searching Globally
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p
                                            className={cn(
                                                'font-bold transition-all duration-500',
                                                layoutMode === 'swapped' ? 'text-[10px]' : 'text-sm',
                                            )}
                                        >
                                            No partner connected
                                        </p>
                                    )}
                                </div>
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
                    onClick={() => layoutMode === 'pip' && setLayoutMode('swapped')}
                    className={cn(
                        'relative overflow-hidden rounded-2xl bg-background/40 transition-all duration-500',
                        layoutMode === 'pip' &&
                            'absolute top-24 right-6 z-10 h-32 w-48 ring-1 ring-border shadow-xl lg:h-40 lg:w-60 cursor-pointer hover:scale-105 active:scale-95',
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
                            className="h-full w-full object-contain scale-x-[-1] pointer-events-none"
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

            {/* Action Buttons Overlay */}
            <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                {/* Layout Toggle Button */}
                {!isSearching && (remoteStream || localStream) && (
                    <button
                        onClick={cycleLayout}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 text-foreground backdrop-blur-xl ring-1 ring-border shadow-lg transition-all hover:bg-background/80 hover:scale-105 active:scale-95"
                        title="Change Layout"
                    >
                        <Layout className="h-5 w-5" />
                    </button>
                )}

                {/* Fullscreen Toggle Button */}
                <button
                    onClick={toggleFullscreen}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 text-foreground backdrop-blur-xl ring-1 ring-border shadow-lg transition-all hover:bg-background/80 hover:scale-105 active:scale-95"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
            </div>

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
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-primary/0 to-transparent animate-pulse" />
                </div>
            )}

            {/* Children / Overlays */}
            {children}
        </div>
    );
};
