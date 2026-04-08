'use client';

import React from 'react';

import * as Dialog from '@radix-ui/react-dialog';

import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/ui/dialog';

interface DeleteMessageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const DeleteMessageDialog: React.FC<DeleteMessageDialogProps> = ({ open, onOpenChange, onConfirm }) => {
    return (
        <DialogWrapper open={open} onOpenChange={onOpenChange}>
            <div className="p-6">
                <Dialog.Title className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    Delete Message
                </Dialog.Title>
                <Dialog.Description className="text-zinc-500 dark:text-zinc-400 mb-6">
                    Are you sure you want to delete this message? This action cannot be undone.
                </Dialog.Description>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        className="bg-red-500 hover:bg-red-600 text-white border-none"
                        onClick={onConfirm}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </DialogWrapper>
    );
};
