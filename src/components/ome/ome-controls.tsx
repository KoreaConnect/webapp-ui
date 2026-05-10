'use client';

import { useState } from 'react';

import { Heart, Mic, MicOff, SkipForward, Video, VideoOff, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { OmeStatus } from '@/hooks/use-ome-session';

import { cn } from '@/utils';

interface OmeControlsProps {
    status: OmeStatus;
    onNext: () => void;
    onStop: () => void;
    onAddFriend?: () => void;
}

export const OmeControls = ({ status, onNext, onStop, onAddFriend }: OmeControlsProps) => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    const isConnected = status === 'connected';

    const handleLike = () => {
        setIsLiked(!isLiked);
        onAddFriend?.();
    };

    if (status === 'idle' || status === 'error') return null;

    return (
        <div className="flex items-center gap-2 rounded-2xl bg-background/80 p-2 backdrop-blur-2xl ring-1 ring-border shadow-2xl">
            {/* Main Actions */}
            <div className="flex items-center gap-1.5 px-2 border-r border-border">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={cn(
                        'h-12 w-12 rounded-xl transition-all duration-300',
                        isMicOn ? 'text-foreground hover:bg-accent' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
                    )}
                >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCamOn(!isCamOn)}
                    className={cn(
                        'h-12 w-12 rounded-xl transition-all duration-300',
                        isCamOn ? 'text-foreground hover:bg-accent' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
                    )}
                >
                    {isCamOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
            </div>

            <div className="flex items-center gap-1.5 px-1">
                {isConnected && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLike}
                        className={cn(
                            'h-12 w-12 rounded-xl transition-all duration-300',
                            isLiked
                                ? 'bg-primary text-white shadow-[0_0_20px_rgba(232,60,145,0.4)]'
                                : 'text-foreground hover:bg-accent',
                        )}
                    >
                        <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
                    </Button>
                )}

                <Button
                    onClick={onNext}
                    className="h-12 gap-2 rounded-xl bg-primary px-6 font-bold text-white shadow-[0_0_20px_rgba(232,60,145,0.4)] transition-all hover:scale-105 hover:opacity-90 active:scale-95"
                >
                    <SkipForward className="h-5 w-5 fill-current" />
                    <span className="hidden sm:inline">NEXT</span>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onStop}
                    className="h-12 w-12 rounded-xl text-foreground/40 hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
