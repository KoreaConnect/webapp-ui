import instance from '@/config/axios';

export const getConversationBySlug = async (slug: string) => {
    try {
        const response = await instance.get(`/chat/conversations/slug/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const joinConversation = async (conversationId: string) => {
    try {
        const response = await instance.post(`/chat/conversations/${conversationId}/join`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
