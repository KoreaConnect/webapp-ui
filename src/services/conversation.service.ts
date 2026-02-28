import instance from '@/config/axios';

export const getConversationBySlug = async (slug: string) => {
    try {
        const response = await instance.get(`/conversations/slug/${slug}`);
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

export const getMessages = async (conversationId: string, limit?: number, before?: string, after?: string) => {
    try {
        const response = await instance.get(`/conversations/${conversationId}/messages`, {
            params: { limit, before, after },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMessageContext = async (conversationId: string, messageId: string, limit?: number) => {
    try {
        const response = await instance.get(`/conversations/${conversationId}/messages/${messageId}/context`, {
            params: { limit },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMembers = async (conversationId: string) => {
    try {
        const response = await instance.get(`/conversations/${conversationId}/members`);
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
