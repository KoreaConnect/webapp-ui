'use client';

import { useAuthStore } from '@/store/use-auth-store';
import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export function JoinChatOverlay() {
    const { conversation, joinChat, isJoining } = useCommunityConversationStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    const handleJoin = () => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        if (conversation) {
            joinChat(conversation.id);
        }
    };

    if (conversation?.is_joined) {
        return null;
    }

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-[1px] p-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-xl border border-border text-center space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Join Community Chat</h2>
                    <p className="text-muted-foreground">
                        Connect with others in this community chat. Share your thoughts and stay updated.
                    </p>
                </div>

                <Button
                    onClick={handleJoin}
                    className="w-full py-6 text-lg font-semibold rounded-xl"
                    disabled={isJoining}
                >
                    {isJoining ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Joining...
                        </div>
                    ) : isAuthenticated ? (
                        'Join Chat'
                    ) : (
                        'Login to Join'
                    )}
                </Button>

                {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground">
                        You need to be logged in to participate in the chat.
                    </p>
                )}
            </div>
        </div>
    );
}
