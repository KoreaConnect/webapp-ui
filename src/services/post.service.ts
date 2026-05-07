import axios from '@/config/axios';
import { CreateThreadPayload, Post, PostResponse, ReplyPostPayload, ThreadResponse } from '@/types/post.type';

export const postService = {
    async createThread(payload: CreateThreadPayload): Promise<PostResponse<Post>> {
        const firstPost = payload.posts[0];
        const hasImages = firstPost?.images && (firstPost.images as File[]).length > 0;

        if (!payload.posts || payload.posts.length === 0) {
            throw new Error('At least one post is required to create a thread');
        }

        if (hasImages) {
            const formData = new FormData();

            // Send posts as a stringified JSON array
            // Images are only attached to the first post per backend logic
            formData.append(
                'posts',
                JSON.stringify(
                    payload.posts.map((p) => ({
                        content: p.content,
                        topic: p.topic,
                    })),
                ),
            );

            (firstPost.images as File[]).forEach((file) => {
                formData.append('images', file);
            });

            const { data } = await axios.post<PostResponse<Post>>('/posts/threads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data;
        } else {
            // If no images, we can send as plain JSON
            const { data } = await axios.post<PostResponse<Post>>('/posts/threads', {
                posts: payload.posts.map((p) => ({
                    content: p.content,
                    topic: p.topic,
                })),
            });
            return data;
        }
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
