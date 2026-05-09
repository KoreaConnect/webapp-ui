'use client';

import { Globe } from 'lucide-react';

import { OmeControls } from '@/components/ome/ome-controls';
import { VideoPanel } from '@/components/ome/video-panel';

import { useOmeSession } from '@/hooks/use-ome-session';

export default function OmePage() {
    const { status, partner, localStream, startSession, stopSession, nextPartner } = useOmeSession();

    return (
        <div className="flex h-[calc(100vh-64px)] w-full flex-col bg-background text-foreground">
            {/* Main Section: Video Panels */}
            <div className="flex flex-1 flex-col p-4 lg:p-6 max-w-7xl mx-auto w-full">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                            <Globe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tighter text-foreground dark:text-white">
                                OME TV
                            </h1>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                14,203 ONLINE
                            </div>
                        </div>
                    </div>

                    {partner && (
                        <div className="flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-900/80 px-4 py-1.5 border border-border backdrop-blur-md">
                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">PARTNER:</span>
                            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                {partner.name} • {partner.location}
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid flex-1 grid-rows-2 gap-4 lg:grid-cols-2 lg:grid-rows-1 lg:gap-6 items-center">
                    <VideoPanel stream={localStream} isLocal label="YOU" />
                    <VideoPanel
                        stream={null} // Mocking remote stream as null for now
                        isSearching={status === 'searching'}
                        label={partner ? partner.name.toUpperCase() : 'PARTNER'}
                    />
                </div>

                <div className="mt-8 flex items-center justify-center">
                    <OmeControls status={status} onStart={startSession} onStop={stopSession} onNext={nextPartner} />
                </div>
            </div>
        </div>
    );
}
