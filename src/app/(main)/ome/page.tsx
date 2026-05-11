'use client';

import { useEffect, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { Globe, Mic, Settings2, Video } from 'lucide-react';

import { FilterModal } from '@/components/ome/filter-modal';
import { MatchOverlay } from '@/components/ome/match-overlay';
import { OmeControls } from '@/components/ome/ome-controls';
import { VideoContainer } from '@/components/ome/video-container';
import { Button } from '@/components/ui/button';

import { useOmeSession } from '@/hooks/use-ome-session';

export default function OmePage() {
    const { status, partner, localStream, chatMode, startSession, stopSession, nextPartner } = useOmeSession();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { show } = useToastStore();

    const isIdle = status === 'idle' || status === 'error';
    const isSearching = status === 'searching';
    const isConnected = status === 'connected';

    useEffect(() => {
        if (status === 'error') {
            show({
                title: 'Permission Denied',
                message: 'Please allow camera and microphone access to start chatting.',
                type: 'error',
            });
            stopSession();
        }
    }, [status, show, stopSession]);

    return (
        <div className="flex h-[calc(100vh-64px)] w-full flex-col bg-background text-foreground transition-colors duration-300">
            {/* Header / Branding */}
            <div className="flex items-center justify-between p-4 lg:px-8 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_15px_rgba(232,60,145,0.4)]">
                        <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter">KOCO</h1>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-50">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            14,203 ONLINE
                        </div>
                    </div>
                </div>

                {isIdle && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFilterOpen(true)}
                        className="rounded-xl hover:bg-accent text-foreground/60 hover:text-foreground"
                    >
                        <Settings2 className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Main Section */}
            <div className="relative flex flex-1 flex-col p-4 lg:p-8 max-w-6xl mx-auto w-full overflow-hidden">
                {isIdle ? (
                    <div className="flex flex-1 flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="space-y-4">
                            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tight leading-none">
                                Meet <span className="text-primary">New</span> People
                            </h2>
                            <p className="opacity-50 text-lg max-w-md mx-auto font-medium">
                                Instant video and voice connections with people around the world.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <Button
                                onClick={() => startSession('video')}
                                className="flex-1 h-16 gap-3 rounded-2xl bg-primary text-white text-lg font-bold shadow-[0_0_30px_rgba(232,60,145,0.3)] hover:opacity-90 transition-all hover:scale-[1.02]"
                            >
                                <Video className="h-6 w-6" />
                                VIDEO CHAT
                            </Button>
                            <Button
                                onClick={() => startSession('voice')}
                                variant="outline"
                                className="flex-1 h-16 gap-3 rounded-2xl text-lg font-bold border-border hover:bg-accent transition-all hover:scale-[1.02]"
                            >
                                <Mic className="h-6 w-6" />
                                VOICE CHAT
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 pt-8">
                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-black">5M+</p>
                                <p className="text-[10px] font-bold opacity-40 uppercase">Matches</p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-black">190+</p>
                                <p className="text-[10px] font-bold opacity-40 uppercase">Countries</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative h-full w-full flex flex-col gap-6">
                        <div className="relative flex-1">
                            <VideoContainer
                                localStream={localStream}
                                remoteStream={isConnected ? new MediaStream() : null}
                                isSearching={isSearching}
                                partnerName={partner?.name}
                                chatMode={chatMode}
                            />

                            <MatchOverlay
                                status={status}
                                partner={partner}
                                onNext={nextPartner}
                                onCancel={stopSession}
                                onAddFriend={() => {}}
                            />
                        </div>

                        {/* Controls Bar */}
                        <div className="flex justify-center pb-4">
                            <OmeControls status={status} onNext={nextPartner} onStop={stopSession} />
                        </div>
                    </div>
                )}
            </div>

            {/* Filter Modal */}
            <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
        </div>
    );
}
