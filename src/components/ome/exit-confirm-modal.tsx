'use client';

import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle, DialogWrapper } from '@/components/ui/dialog';

interface ExitConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ExitConfirmModal = ({ isOpen, onClose, onConfirm }: ExitConfirmModalProps) => {
    return (
        <DialogWrapper open={isOpen} onOpenChange={onClose}>
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold">End Chat Session?</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            You are about to leave your current conversation. Your match will be disconnected.
                        </DialogDescription>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl h-12 font-bold">
                        STAY
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 rounded-xl h-12 font-bold bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
                    >
                        LEAVE CHAT
                    </Button>
                </div>
            </div>
        </DialogWrapper>
    );
};
