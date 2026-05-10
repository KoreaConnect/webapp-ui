'use client';

import { Heart, Loader2, MapPin, RefreshCw, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { OmePartner, OmeStatus } from '@/hooks/use-ome-session';

interface MatchOverlayProps {
    status: OmeStatus;
    partner: OmePartner | null;
    onNext: () => void;
    onCancel: () => void;
    onAddFriend?: () => void;
}

export const MatchOverlay = ({ status, partner, onNext, onCancel, onAddFriend }: MatchOverlayProps) => {
    if (status === 'idle' || status === 'connected' || status === 'error') return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md transition-all duration-500">
            <div className="w-full max-w-sm rounded-3xl bg-background p-8 text-center shadow-2xl ring-1 ring-border animate-in fade-in zoom-in duration-300">
                {status === 'searching' && (
                    <div className="space-y-6">
                        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">
                                Finding Match...
                            </h2>
                            <div className="flex items-center justify-center gap-1.5 text-primary">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm font-bold">Searching Globally</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={onCancel}
                            className="w-full rounded-2xl bg-accent py-6 font-bold text-foreground hover:bg-accent/80"
                        >
                            <X className="mr-2 h-5 w-5" />
                            CANCEL
                        </Button>
                    </div>
                )}

                {status === 'ended' && (
                    <div className="space-y-6">
                        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
                            <X className="h-10 w-10 text-red-500" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">
                                Chat Ended
                            </h2>
                            <p className="opacity-50 text-sm font-medium">Would you like to keep in touch?</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={onAddFriend}
                                className="rounded-2xl bg-primary py-6 font-bold text-white shadow-[0_0_20px_rgba(232,60,145,0.4)] hover:opacity-90"
                            >
                                <Heart className="mr-2 h-5 w-5 fill-current" />
                                ADD
                            </Button>
                            <Button
                                onClick={onNext}
                                variant="outline"
                                className="rounded-2xl border-border py-6 font-bold text-foreground hover:bg-accent"
                            >
                                <RefreshCw className="mr-2 h-5 w-5" />
                                NEXT
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
