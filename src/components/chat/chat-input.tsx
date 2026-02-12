'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { EditorContent } from '@tiptap/react';
import { Send, Smile } from 'lucide-react';

// Import Smile icon

import { Button } from '@/components/ui/button';

import { useTiptapEditor } from '@/hooks/use-tiptap-editor';

import { cn } from '@/utils';

import { EmojiPicker } from './emoji-picker';

// Import the new EmojiPicker component

interface ChatInputProps {
    onSend: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const ChatInput = forwardRef<{ focusEditor: () => void }, ChatInputProps>(
    ({ onSend, placeholder = 'Type a message...', disabled = false }, ref) => {
        const editor = useTiptapEditor({ placeholderText: placeholder });
        const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

        useImperativeHandle(ref, () => ({
            focusEditor: () => {
                editor?.commands.focus();
            },
        }));

        const handleSend = () => {
            if (editor) {
                const content = editor.getHTML();
                const textContent = editor.getText();
                if (textContent.trim()) {
                    onSend(content);
                    editor.chain().clearContent().focus().run();
                }
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        };

        const handleEmojiSelect = (emoji: string) => {
            if (editor) {
                editor.commands.insertContent(emoji);
                editor.commands.focus();
            }
        };

        const handleClickOutsideEmojiPicker = () => {
            setIsEmojiPickerVisible(false);
            editor?.commands.focus();
        };

        return (
            <div className="flex flex-col gap-2 p-4 mb-4 border-t border-border" onKeyDown={handleKeyDown}>
                <div className="flex items-end gap-2 relative">
                    {' '}
                    {/* Changed to items-end for vertical alignment of buttons */}
                    <div
                        className={cn(
                            'flex-1 max-w-full min-w-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-2xl py-2 min-h-10.5 text-md border border-border',
                            'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
                            isEmojiPickerVisible ? 'border-primary ring-1 ring-primary' : '',
                        )}
                    >
                        <EditorContent editor={editor} className="max-h-40 overflow-y-auto px-2" />
                    </div>
                    <div className="flex items-center gap-1">
                        {' '}
                        {/* Wrapper for emoji and send buttons */}
                        <button
                            type="button"
                            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
                            onMouseDown={(e) => e.preventDefault()} // Prevents editor from losing focus
                            title="Select emoji"
                        >
                            <Smile className="h-5 w-5 text-zinc-500" />
                        </button>
                        <Button
                            type="button"
                            size="icon"
                            className="rounded-full shrink-0"
                            onClick={handleSend}
                            disabled={disabled || !editor?.getText().trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <EmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                        isVisible={isEmojiPickerVisible}
                        onClose={handleClickOutsideEmojiPicker}
                    />
                </div>
            </div>
        );
    },
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
