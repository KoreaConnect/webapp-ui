'use client';

import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { Loader2 } from 'lucide-react';

export function MediaList() {
    const { conversation, media, isMediaLoading, hasMoreMedia, fetchAttachments } = useCommunityConversationStore();

    if (!conversation) return null;

    const handleLoadMore = () => {
        fetchAttachments(conversation.id, 'image', true);
    };

    if (media.length === 0 && isMediaLoading) {
        return (
            <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (media.length === 0) {
        return <p className="text-center py-4 text-xs text-muted-foreground">No media found</p>;
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1">
                {media.map((item) => (
                    <div
                        key={item.id}
                        className="aspect-square relative rounded-md overflow-hidden bg-accent hover:opacity-80 transition cursor-pointer"
                        onClick={() => window.open(item.url, '_blank')}
                    >
                        <img src={item.url} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                ))}
            </div>
            {hasMoreMedia && (
                <button
                    onClick={handleLoadMore}
                    disabled={isMediaLoading}
                    className="w-full py-2 text-xs text-primary hover:underline font-medium disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isMediaLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                    View more
                </button>
            )}
        </div>
    );
}
