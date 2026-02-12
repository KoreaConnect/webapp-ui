'use client';

import React, { forwardRef, useImperativeHandle } from 'react';

import { EditorContent } from '@tiptap/react';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useTiptapEditor } from '@/hooks/use-tiptap-editor';

interface ChatInputProps {
    onSend: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const ChatInput = forwardRef<
    {
        focusEditor: () => void;
    },
    ChatInputProps
>(({ onSend, placeholder = 'Type a message...', disabled = false }, ref) => {
    const editor = useTiptapEditor({ placeholderText: placeholder });

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

    return (
        <div className="flex flex-col gap-2 p-4 mb-4 border-t border-border" onKeyDown={handleKeyDown}>
            <div className="flex items-center gap-2">
                <div
                    className="flex-1 max-w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-2xl py-2 min-h-10.5 text-md
                                border border-border 
                                focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
                >
                    <EditorContent editor={editor} className="max-h-40 overflow-y-auto mx-2" />
                </div>
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
        </div>
    );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
