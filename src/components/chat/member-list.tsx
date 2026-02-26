'use client';

import { useCommunityConversationStore } from '@/store/use-community-conversation-store';

import { Loader } from '@/components/ui/loader';

import Avatar from '../ui/avatar';

export function MemberList() {
    const { members, isMembersLoading } = useCommunityConversationStore();

    if (isMembersLoading) {
        return (
            <div className="flex justify-center p-4">
                <Loader size={20} />
            </div>
        );
    }

    if (members.length === 0) {
        return <p className="text-sm text-center text-muted-foreground p-4">No members found.</p>;
    }

    return (
        <div className="space-y-2">
            {members.map((member) => (
                <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition cursor-pointer"
                >
                    <Avatar
                        src={member.avatar}
                        alt={member.name}
                        fallback={member.name.charAt(0).toUpperCase()}
                        className="h-8 w-8"
                    />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {member.isOnline ? <span className="text-green-500">Online</span> : 'Offline'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
