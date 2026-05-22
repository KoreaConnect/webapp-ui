'use client';

import React, { useCallback, useEffect, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImagePreviewProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ images, initialIndex, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);

    // Sync state with prop when initialIndex changes or modal opens
    if (isOpen && initialIndex !== prevInitialIndex) {
        setPrevInitialIndex(initialIndex);
        setCurrentIndex(initialIndex);
    }

    const handlePrevious = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        },
        [images.length],
    );

    const handleNext = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        },
        [images.length],
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') onClose();
        };

        if (isOpen && images.length > 0) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, images.length, handleNext, handlePrevious, onClose]);

    const currentImage = images[currentIndex];

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed inset-0 z-[101] flex items-center justify-center outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                    <Dialog.Title className="sr-only">Image Preview</Dialog.Title>
                    <Dialog.Description className="sr-only">
                        Image {currentIndex + 1} of {images.length}
                    </Dialog.Description>

                    <Dialog.Close className="fixed right-6 top-6 rounded-full p-2.5 bg-zinc-800/50 hover:bg-zinc-700/80 text-white/90 transition-all hover:scale-110 active:scale-95 z-[102] cursor-pointer outline-none">
                        <X className="w-6 h-6" />
                    </Dialog.Close>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="fixed left-6 top-1/2 -translate-y-1/2 rounded-full p-3 bg-zinc-800/50 hover:bg-zinc-700/80 text-white/90 transition-all hover:scale-110 active:scale-95 z-[102] cursor-pointer outline-none"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="fixed right-6 top-1/2 -translate-y-1/2 rounded-full p-3 bg-zinc-800/50 hover:bg-zinc-700/80 text-white/90 transition-all hover:scale-110 active:scale-95 z-[102] cursor-pointer outline-none"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-zinc-800/50 text-white/90 text-sm font-medium z-[102]">
                                {currentIndex + 1} / {images.length}
                            </div>
                        </>
                    )}

                    {currentImage && (
                        <div className="relative w-full h-full p-4 md:p-20 flex items-center justify-center pointer-events-none">
                            <img
                                src={currentImage}
                                alt={`Preview ${currentIndex + 1}`}
                                className="max-w-full max-h-full object-contain rounded-md shadow-2xl select-none pointer-events-auto"
                                draggable={false}
                            />
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
