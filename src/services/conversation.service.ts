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

export const getMessages = async (conversationId: string, limit?: number, before?: string) => {
    try {
        const response = await instance.get(`/conversations/${conversationId}/messages`, {
            params: { limit, before },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendMessage = async (conversationId: string, content: string, replyToMessageId?: string | null) => {
    try {
        const response = await instance.post(`/conversations/${conversationId}/messages`, {
            content,
            reply_to_message_id: replyToMessageId,
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
