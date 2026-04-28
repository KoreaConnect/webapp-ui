import axios from '@/config/axios';
import { CreateThreadPayload, Post, PostResponse, ReplyPostPayload } from '@/types/post.type';

export const postService = {
    async createThread(payload: CreateThreadPayload): Promise<PostResponse<Post>> {
        // Since we are now using multipart/form-data for images, we use FormData
        const formData = new FormData();

        // The payload for createThread was { posts: [{ content, topic, images: File[] }] }
        // Based on the new API guide: content, topic, and multiple 'images' fields
        if (payload.posts && payload.posts.length > 0) {
            const firstPost = payload.posts[0];
            formData.append('content', firstPost.content);
            if (firstPost.topic) formData.append('topic', firstPost.topic);

            if (firstPost.images && firstPost.images.length > 0) {
                // If they are Files, append them
                (firstPost.images as unknown as File[]).forEach((file) => {
                    formData.append('images', file);
                });
            }
        }

        const { data } = await axios.post<PostResponse<Post>>('/posts/threads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    async replyPost(payload: ReplyPostPayload): Promise<PostResponse<Post>> {
        const formData = new FormData();
        formData.append('content', payload.content);
        formData.append('parent_id', payload.parent_id);

        if (payload.images && payload.images.length > 0) {
            (payload.images as unknown as File[]).forEach((file) => {
                formData.append('images', file);
            });
        }

        const { data } = await axios.post<PostResponse<Post>>('/posts/replies', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    async getPosts(params?: { limit?: number; offset?: number; topic?: string }): Promise<PostResponse<Post[]>> {
        const { data } = await axios.get<PostResponse<Post[]>>('/posts', { params });
        return data;
    },

    async getThread(rootId: string): Promise<PostResponse<ThreadResponse>> {
        const { data } = await axios.get<PostResponse<ThreadResponse>>(`/posts/threads/${rootId}`);
        return data;
    },

    async deletePost(id: string): Promise<PostResponse<{ success: boolean }>> {
        const { data } = await axios.delete<PostResponse<{ success: boolean }>>(`/posts/${id}`);
        return data;
    },
};
