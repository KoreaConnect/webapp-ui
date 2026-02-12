import React from 'react';

import { File, X } from 'lucide-react';

import { cn } from '@/utils/cn';

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
    const isImage = file.type.startsWith('image/');
    const previewUrl = isImage ? URL.createObjectURL(file) : null;

    return (
        <div className="relative flex items-center gap-2 rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 min-w-[150px] max-w-[200px] overflow-hidden mb-1">
            {isImage && previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt={file.name} className="h-10 w-10 object-cover rounded-md shrink-0" />
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-500 shrink-0">
                    <File size={16} />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{file.name}</p>
                <p className="text-[10px] text-zinc-500">{Math.round(file.size / 1024)} KB</p>
            </div>
            <button
                onClick={onRemove}
                className="p-1 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors shrink-0"
                title="Remove file"
            >
                <X size={14} />
            </button>
        </div>
    );
};
