export type ReadReceipt = {
    user: BasicUserInfo;
    readAt: string;
};

export interface BasicUserInfo {
    id: number;
    name: string;
    username: string;
    picture: string | null;
}

export type MessageSender = 'me' | 'other' | 'system';

export type User = {
    id: string | number;
    name: string;
    avatar?: string;
    picture?: string;
    username?: string;
    isOnline?: boolean;
};

export type MessageMetadata = {
    type: 'USER_JOINED' | 'USER_LEFT' | string;
    user?: User;
    user_id?: string | number;
};

export type Message = {
    id: string;
    text: string;
    sender: MessageSender;
    type?: 'text' | 'system';
    content?: string;
    metadata?: MessageMetadata;
    time?: string;
    name?: string;
    avatar?: string;
    readBy?: ReadReceipt[];
    created_at?: string;
    reactions?: Record<string, string[]>;
    read_by?: { user: BasicUserInfo; read_at: string | Date }[];
    reply_to_message_id?: string | null;
    reply_to_message?: Message | null;
};

export type RawMessage = {
    id: string | number;
    content: string;
    type: 'text' | 'system' | string;
    sender_id: string | number;
    conversation_id: string | number;
    created_at: string;
    sender?: {
        name: string;
        picture?: string;
        avatar?: string;
    };
    metadata?: MessageMetadata;
    reactions?: {
        user: BasicUserInfo;
        reaction: string;
    }[];
    read_by?: {
        user: BasicUserInfo;
        read_at: string;
    }[];
    reply_to_message_id?: string | null;
    reply_to_message?: RawMessage | null;
};

export type ReactionMap = Record<string, Record<string, string[]>>;

export type Conversation = {
    id: string;
    title: string;
    thumbnail_url?: string;
    description?: string;
    participants: User[];
    onlineCount?: number;
    createdAt: string;
    created_at?: string;
    createdBy: string | null;
    created_by?: string | null;
    type: string;
    slug: string;
    is_public: boolean;
    is_joined: boolean;
    members_count?: number;
    post_id: string | null;
    last_message_id: string | null;
    last_message_at: string | null;
};
