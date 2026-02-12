'use client';

import React from 'react';

import data, { Emoji, Skin } from '@emoji-mart/data';
// Keep data import, use type import for Emoji
import dynamic from 'next/dynamic';

import { cn } from '@/utils/cn';

// Dynamically import the Picker component with SSR disabled
const Picker = dynamic(
    () =>
        import('@emoji-mart/react').then((mod) => {
            return mod.default; // Assuming default export is the Picker component
        }),
    { ssr: false },
);

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
    isVisible: boolean;
    onClose: () => void;
    className?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, isVisible, onClose, className }) => {
    if (!isVisible) return null;

    return (
        <div className={cn('absolute bottom-full right-0 mb-2 z-50', className)}>
            <Picker
                data={data}
                theme="light"
                perLine={8}
                previewPosition="none"
                navPosition="none"
                skinTonePosition="none"
                icons="outline"
                className="emoji-mart-picker"
                onClickOutside={onClose}
                onEmojiSelect={(emoji: Skin) => {
                    // Use imported Emoji type
                    console.log(emoji);
                    onEmojiSelect(emoji.native);
                }}
            />
        </div>
    );
};
