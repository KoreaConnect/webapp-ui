'use client';

import { useEffect, useState } from 'react';

import { useCurrentConversationStore } from '@/store/use-current-conversation-store';
import { Loader2 } from 'lucide-react';

import { ImagePreview } from '@/components/feed/image-preview';

export function MediaList() {
    const { conversation, media, isMediaLoading, hasMoreMedia, fetchAttachments } = useCurrentConversationStore();
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    useEffect(() => {
        if (conversation?.id && media.length === 0 && !isMediaLoading && hasMoreMedia) {
            fetchAttachments(conversation.id, 'image');
        }
    }, [conversation?.id, media.length, isMediaLoading, hasMoreMedia, fetchAttachments]);

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
        <>
            <div className="space-y-2">
                <div className="grid grid-cols-3 gap-1">
                    {media.map((item, idx) => (
                        <div
                            key={item.id}
                            className="aspect-square relative rounded-md overflow-hidden bg-accent hover:opacity-80 transition cursor-pointer"
                            onClick={() => setPreviewIndex(idx)}
                        >
                            <img
                                src={item.url}
                                alt={item.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
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
            <ImagePreview
                images={media.map((item) => item.url)}
                initialIndex={previewIndex ?? 0}
                isOpen={previewIndex !== null}
                onClose={() => setPreviewIndex(null)}
            />
        </>
    );
}
