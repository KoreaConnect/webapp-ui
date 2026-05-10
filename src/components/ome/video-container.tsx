'use client';

import { useEffect, useRef } from 'react';

import { User } from 'lucide-react';

import { cn } from '@/utils';

interface VideoContainerProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isSearching?: boolean;
    partnerName?: string;
    chatMode?: 'video' | 'voice';
}

export const VideoContainer = ({
    localStream,
    remoteStream,
    isSearching,
    partnerName,
    chatMode = 'video',
}: VideoContainerProps) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

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

    return (
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-accent shadow-2xl ring-1 ring-border">
            {/* Remote Video (Full Screen) */}
            <div className="absolute inset-0 flex items-center justify-center">
                {remoteStream && chatMode === 'video' ? (
                    <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-4 opacity-40">
                        <div
                            className={cn(
                                'flex h-24 w-24 items-center justify-center rounded-full bg-background backdrop-blur-xl ring-1 ring-border',
                                isSearching && 'animate-pulse',
                            )}
                        >
                            <User className="h-12 w-12" />
                        </div>
                        {isSearching ? (
                            <div className="text-center">
                                <p className="text-lg font-bold text-foreground">Finding match...</p>
                                <p className="text-sm">Searching globally</p>
                            </div>
                        ) : (
                            <p className="text-sm font-medium">No partner connected</p>
                        )}
                    </div>
                )}
            </div>

            {/* Local Video (PiP) */}
            <div className="absolute bottom-6 right-6 h-32 w-48 overflow-hidden rounded-2xl bg-background/40 backdrop-blur-md ring-1 ring-border shadow-xl lg:h-40 lg:w-60">
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

            {/* Partner Info Overlay */}
            {partnerName && !isSearching && (
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
