'use client';

import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { Loader2 } from 'lucide-react';

import Avatar from '../ui/avatar';

export function MemberList() {
    const { conversation, members, isMembersLoading, hasMoreMembers, fetchMembers } = useCommunityConversationStore();

    if (!conversation) return null;

    const handleLoadMore = () => {
        fetchMembers(conversation.id, true);
    };

    if (members.length === 0 && isMembersLoading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (members.length === 0) {
        return <p className="text-sm text-center text-muted-foreground p-4">No members found.</p>;
    }

    return (
        <div className="space-y-1">
            {members.map((member) => (
                <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition cursor-pointer group"
                >
                    <Avatar
                        src={member.avatar}
                        alt={member.name}
                        fallback={member.name.charAt(0).toUpperCase()}
                        className="h-8 w-8"
                    />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {member.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
                            />
                            {member.isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
            ))}
            {hasMoreMembers && (
                <button
                    onClick={handleLoadMore}
                    disabled={isMembersLoading}
                    className="w-full py-2 mt-2 text-xs text-primary hover:underline font-medium disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isMembersLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                    View more
                </button>
            )}
        </div>
    );
}
