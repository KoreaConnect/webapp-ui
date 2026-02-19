'use client';

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { ACCEPTABLE_MIME_TYPES, ACCEPTABLE_MIME_TYPES_STRING } from '@/constants/file-types';
import { useToastStore } from '@/store/use-toast-store';
import { EditorContent } from '@tiptap/react';
import { Paperclip, Send, Smile } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollableView } from '@/components/ui/scrollable-view';

// Import file types
import { useTiptapEditor } from '@/hooks/use-tiptap-editor';

import { cn } from '@/utils';

import { EmojiPicker } from './emoji-picker';
import { FilePreview } from './file-preview';

// Import FilePreview component

const MAX_FILES = 5;

interface ChatInputProps {
    onSend: (message: string, files: File[]) => void; // onSend now accepts files
    placeholder?: string;
    disabled?: boolean;
}

const ChatInput = forwardRef<{ focusEditor: () => void }, ChatInputProps>(
    ({ onSend, placeholder = 'Type a message...', disabled = false }, ref) => {
        const editor = useTiptapEditor({ placeholderText: placeholder });
        const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
        const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // State for multiple selected files
        const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input
        const { show } = useToastStore(); // Use toast for feedback

        useImperativeHandle(ref, () => ({
            focusEditor: () => {
                editor?.commands.focus();
            },
        }));

        const handleSend = () => {
            if (editor && (editor.getText().trim() || selectedFiles.length > 0)) {
                // const content = editor.getHTML();
                const textContent = editor.getText();
                onSend(textContent, selectedFiles); // Pass content and files
                editor.chain().clearContent().focus().run();
                setSelectedFiles([]); // Clear selected files after sending
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clear file input value
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
            // Keep picker visible
        };

        const handleClickOutsideEmojiPicker = () => {
            setIsEmojiPickerVisible(false);
            editor?.commands.focus();
        };

        const handleFileUploadClick = () => {
            if (selectedFiles.length < MAX_FILES) {
                fileInputRef.current?.click(); // Trigger click on hidden file input
            } else {
                show({
                    type: 'error',
                    message: `You can attach up to ${MAX_FILES} files only.`,
                    title: 'File Limit Reached',
                });
                editor?.commands.focus();
            }
        };

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files || []);
            const validFiles: File[] = [];
            const invalidFiles: string[] = [];

            files.forEach((file) => {
                if (ACCEPTABLE_MIME_TYPES.includes(file.type)) {
                    validFiles.push(file);
                } else {
                    invalidFiles.push(file.name);
                }
            });

            if (invalidFiles.length > 0) {
                show({
                    type: 'error',
                    message: `Unsupported file types: ${invalidFiles.join(', ')}. Only images and text files are allowed.`,
                    title: 'Invalid File Type',
                });
            }

            const newFiles = validFiles.slice(0, MAX_FILES - selectedFiles.length);
            setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
            editor?.commands.focus(); // Keep focus on editor after file selection
        };

        const handleRemoveFile = (fileToRemove: File) => {
            setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
            // No need to clear file input value if we want to allow re-selecting the same file later
            editor?.commands.focus();
        };

        console.log('test', disabled || (!editor?.getText().trim() && selectedFiles.length === 0));

        return (
            <div className="flex flex-col gap-2 p-4 mb-4 border-t border-border" onKeyDown={handleKeyDown}>
                {selectedFiles.length > 0 && (
                    <ScrollableView horizontal className="pb-2">
                        <div className="flex gap-2">
                            {selectedFiles.map((file, index) => (
                                <FilePreview
                                    key={file.name + file.size + index}
                                    file={file}
                                    onRemove={() => handleRemoveFile(file)}
                                />
                            ))}
                            {selectedFiles.length >= MAX_FILES && (
                                <span className="text-[12px] text-red-500 font-medium self-center">
                                    Max {MAX_FILES} files
                                </span>
                            )}
                        </div>
                    </ScrollableView>
                )}
                <div className="flex items-end gap-2 relative">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                        accept={ACCEPTABLE_MIME_TYPES_STRING}
                    />

                    {/* File Upload Button */}
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
                        onClick={handleFileUploadClick}
                        title="Attach file"
                        disabled={selectedFiles.length >= MAX_FILES}
                    >
                        <Paperclip className="h-5 w-5 text-zinc-500" />
                    </button>

                    <div
                        className={cn(
                            'flex-1 max-w-full min-w-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-2xl py-2 min-h-[42px] text-md',
                            'border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
                            isEmojiPickerVisible ? 'border-primary ring-1 ring-primary' : '',
                        )}
                    >
                        <EditorContent editor={editor} className="max-h-40 overflow-y-auto px-2" />
                    </div>
                    <div className="flex items-center gap-1">
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
                            disabled={disabled || (!editor?.getText().trim() && selectedFiles.length === 0)}
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
