export type ReadReceipt = {
    userId: string;
    name: string;
    avatar: string;
    readAt: string;
};

export type MessageSender = 'me' | 'other';

export type User = {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
};

export type Conversation = {
    id: string;
    title: string;
    thumbnail_url?: string;
    description?: string;
    participants?: User[];
    onlineCount?: number;
    createdAt: string;
    created_at?: string;
    createdBy: string | null;
    created_by?: string | null;
    type: string;
    slug: string;
    is_public: boolean;
    is_joined?: boolean;
    members_count?: number;
    post_id: string | null;
    last_message_id: string | null;
    last_message_at: string | null;
};
