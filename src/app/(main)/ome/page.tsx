'use client';

import { useEffect, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { Globe, Mic, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ExitConfirmModal } from '@/components/ome/exit-confirm-modal';
import { MatchOverlay } from '@/components/ome/match-overlay';
import { OmeControls } from '@/components/ome/ome-controls';
import { VideoContainer } from '@/components/ome/video-container';
import { Button } from '@/components/ui/button';

import { useOmeSession } from '@/hooks/use-ome-session';

export default function OmePage() {
    const router = useRouter();
    const {
        status,
        partner,
        localStream,
        chatMode,
        error,
        isAudioEnabled,
        isVideoEnabled,
        startSession,
        stopSession,
        nextPartner,
        toggleAudio,
        toggleVideo,
    } = useOmeSession();
    const { show } = useToastStore();
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);

    const isIdle = status === 'idle' || status === 'error';
    const isSearching = status === 'searching';
    const isConnected = status === 'connected';

    // Handle hard refresh / tab close
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isIdle) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isIdle]);

    // Handle client-side navigation (Link clicks)
    useEffect(() => {
        if (isIdle) return;

        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.href && anchor.target !== '_blank') {
                const url = new URL(anchor.href);
                // Check if it's an internal link and actually changing the page
                if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
                    e.preventDefault();
                    setPendingUrl(anchor.href);
                    setIsExitModalOpen(true);
                }
            }
        };

        // Capture clicks at the document level
        document.addEventListener('click', handleLinkClick, true);
        return () => document.removeEventListener('click', handleLinkClick, true);
    }, [isIdle]);

    useEffect(() => {
        if (status === 'error' && error) {
            let title = 'Connection Error';
            let message = 'An error occurred while starting the session.';

            if (error.name === 'NotAllowedError') {
                title = 'Permission Denied';
                message = 'Please allow camera and microphone access to start chatting.';
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                title = 'Device Not Found';
                message = 'No camera or microphone was found on your device.';
            }

            show({
                title,
                message,
                type: 'error',
            });
            stopSession();
        }
    }, [status, error, show, stopSession]);

    const handleStopClick = () => {
        if (isConnected || isSearching) {
            setIsExitModalOpen(true);
        } else {
            stopSession();
        }
    };

    const confirmExit = () => {
        const urlToNavigate = pendingUrl;
        setIsExitModalOpen(false);
        setPendingUrl(null);
        stopSession();

        if (urlToNavigate) {
            router.push(urlToNavigate);
        }
    };

    const cancelExit = () => {
        setIsExitModalOpen(false);
        setPendingUrl(null);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] w-full flex-col bg-background text-foreground transition-colors duration-300 border-r border-border">
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
                            >
                                <MatchOverlay
                                    status={status}
                                    partner={partner}
                                    onNext={nextPartner}
                                    onCancel={handleStopClick}
                                    onAddFriend={() => {}}
                                />

                                {/* Controls Bar Overlay */}
                                <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 w-full max-w-fit px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <OmeControls
                                        status={status}
                                        onNext={nextPartner}
                                        onStop={handleStopClick}
                                        isMicOn={isAudioEnabled}
                                        isCamOn={isVideoEnabled}
                                        onToggleMic={toggleAudio}
                                        onToggleCam={toggleVideo}
                                    />
                                </div>
                            </VideoContainer>
                        </div>
                    </div>
                )}
            </div>

            <ExitConfirmModal isOpen={isExitModalOpen} onClose={cancelExit} onConfirm={confirmExit} />
        </div>
    );
}
