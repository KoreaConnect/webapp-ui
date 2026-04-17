import instance from '@/config/axios';
import type { Attachment, PaginatedResponse, RawConversationMember, RawMessage } from '@/types/chat.type';

export const getConversationBySlug = async (slug: string) => {
    try {
        const response = await instance.get(`/conversations/slug/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getConversationById = async (id: string) => {
    try {
        const response = await instance.get(`/conversations/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const joinConversation = async (conversationId: string) => {
    try {
        const response = await instance.post(`/conversations/${conversationId}/join`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const leaveConversation = async (conversationId: string) => {
    try {
        const response = await instance.post(`/conversations/${conversationId}/leave`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMessages = async (
    conversationId: string,
    limit?: number,
    before?: string,
    after?: string,
    before_id?: string,
    after_id?: string,
): Promise<PaginatedResponse<RawMessage[]>> => {
    try {
        const response = await instance.get(`/conversations/${conversationId}/messages`, {
            params: { limit, before, after, before_id, after_id },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMessageContext = async (
    conversationId: string,
    messageId: string,
    limit?: number,
): Promise<PaginatedResponse<RawMessage[]>> => {
    try {
        const response = await instance.get(`/conversations/${conversationId}/messages/${messageId}/context`, {
            params: { limit },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMembers = async (
    conversationId: string,
    params: {
        limit?: number;
        before?: string;
        beforeId?: string | number;
    } = {},
): Promise<{ data: { members: RawConversationMember[]; total: number; hasMore: boolean } }> => {
    try {
        const response = await instance.get(`/conversations/${conversationId}/members`, {
            params,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAttachments = async (
    conversationId: string,
    params: {
        type?: 'image' | 'file' | 'video' | 'audio';
        limit?: number;
        before?: string;
        beforeId?: string;
    } = {},
): Promise<{ data: { attachments: Attachment[]; hasMore: boolean } }> => {
    try {
        const response = await instance.get(`/conversations/${conversationId}/attachments`, {
            params,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendMessage = async (
    conversationId: string,
    content: string,
    files: File[],
    replyToMessageId?: string | null,
    mentions?: (string | number)[],
) => {
    try {
        if (files && files.length > 0) {
            const formData = new FormData();
            formData.append('content', content);
            if (replyToMessageId) {
                formData.append('reply_to_message_id', replyToMessageId);
            }
            if (mentions && mentions.length > 0) {
                formData.append('mentions', JSON.stringify(mentions));
            }
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await instance.post(`/conversations/${conversationId}/messages`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        }
        const response = await instance.post(`/conversations/${conversationId}/messages`, {
            content,
            reply_to_message_id: replyToMessageId,
            mentions,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchMessages = async (
    conversationId: string,
    query: string,
    limit: number = 20,
    offset: number = 0,
): Promise<PaginatedResponse<RawMessage[]>> => {
    try {
        const response = await instance.get(`/conversations/${conversationId}/messages/search`, {
            params: { query, limit, offset },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const markAsRead = async (conversationId: string, lastMessageId: string | number) => {
    try {
        const response = await instance.post(`/conversations/${conversationId}/read`, {
            last_message_id: lastMessageId,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addReaction = async (messageId: string | number, reaction: string) => {
    try {
        const response = await instance.post(`/messages/${messageId}/reactions`, {
            reaction,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeReaction = async (messageId: string | number, reaction: string) => {
    try {
        const response = await instance.delete(`/messages/${messageId}/reactions`, {
            data: { reaction },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteMessage = async (messageId: string | number) => {
    try {
        const response = await instance.delete(`/messages/${messageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export interface CreatePostConversationRequest {
    post_id: string | number;
    post_type: 'airport_ride' | string;
    owner_id: number;
    message: string;
}

export const createPostConversation = async (payload: CreatePostConversationRequest) => {
    try {
        const response = await instance.post('/conversations/post', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createDirectConversation = async (payload: {
    type: string;
    direct_user: string | number;
    message: string;
    postId: string | number;
}) => {
    try {
        const response = await instance.post('/conversations', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyConversations = async (limit?: number, offset?: number) => {
    try {
        const response = await instance.get('/conversations', {
            params: { limit, offset },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
