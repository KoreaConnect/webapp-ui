import type { BasicUserInfo, HateoasLink } from '@/types/chat.type';

export type Post = {
    id: string;
    user_id: number | string;
    content: string;
    topic?: string;
    images?: string[];
    reply_count: number;
    created_at: string;
    updated_at?: string;
    user: BasicUserInfo;
    parent_id?: string | null;
    root_id?: string | null;
};

export type ThreadResponse = {
    main_chain: Post[];
    replies: Post[];
};

export type PostPagination = {
    total: number;
    limit: number;
    offset: number;
};

export type PostResponse<T> = {
    success: boolean;
    data: T;
    pagination?: PostPagination;
    links?: Record<string, HateoasLink>;
    error?: {
        message: string;
        code?: string;
    };
};

export type CreatePostPayload = {
    content: string;
    topic?: string;
    images?: File[] | string[];
};

export type CreateThreadPayload = {
    posts: CreatePostPayload[];
};

export type ReplyPostPayload = {
    content: string;
    parent_id: string;
    images?: File[] | string[];
};
