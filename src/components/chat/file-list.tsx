'use client';

import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { FileText, Loader2 } from 'lucide-react';

import { formatDate, formatFileSize } from '@/utils';

export function FileList() {
    const { conversation, files, isFilesLoading, hasMoreFiles, fetchAttachments } = useCommunityConversationStore();

    if (!conversation) return null;

    const handleLoadMore = () => {
        fetchAttachments(conversation.id, 'file', true);
    };

    if (files.length === 0 && isFilesLoading) {
        return (
            <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (files.length === 0) {
        return <p className="text-center py-4 text-xs text-muted-foreground">No files found</p>;
    }

    return (
        <div className="space-y-1">
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition cursor-pointer group"
                    onClick={() => window.open(file.url, '_blank')}
                >
                    <div className="p-2 rounded bg-accent group-hover:bg-accent/80">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{file.name || 'Unnamed File'}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • {formatDate(file.created_at)}
                        </p>
                    </div>
                </div>
            ))}
            {hasMoreFiles && (
                <button
                    onClick={handleLoadMore}
                    disabled={isFilesLoading}
                    className="w-full py-2 text-xs text-primary hover:underline font-medium disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isFilesLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                    View more
                </button>
            )}
        </div>
    );
}
