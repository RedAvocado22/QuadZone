import apiClient from "./axios";
import { USE_MOCK_DATA } from "./config";
import { mockPosts, filterPosts, delay } from "../_mock/mock-data";

// ----------------------------------------------------------------------

export interface Post {
    id: string;
    title: string;
    description: string;
    coverUrl?: string;
    totalViews?: number;
    totalComments?: number;
    totalShares?: number;
    totalFavorites?: number;
    postedAt: string | Date;
    author: {
        name: string;
        avatarUrl?: string;
    };
}

export interface PostsResponse {
    data: Post[];
    total: number;
    page: number;
    pageSize: number;
}

// ----------------------------------------------------------------------

export const postsApi = {
    // Get all posts
    getAll: async (params?: {
        page?: number;
        pageSize?: number;
        search?: string;
        sortBy?: "latest" | "popular" | "oldest";
    }): Promise<PostsResponse> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            return filterPosts(mockPosts, params);
        }
        const response = await apiClient.get("/posts", { params });
        return response.data;
    },

    // Get post by ID
    getById: async (id: string): Promise<Post> => {
        if (USE_MOCK_DATA) {
            await delay(200);
            const post = mockPosts.find((p) => p.id === id);
            if (!post) {
                throw new Error("Post not found");
            }
            return post;
        }
        const response = await apiClient.get(`/posts/${id}`);
        return response.data;
    },

    // Create post
    create: async (post: Omit<Post, "id">): Promise<Post> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            const newPost: Post = {
                ...post,
                id: `post-${Date.now()}`
            };
            mockPosts.unshift(newPost);
            return newPost;
        }
        const response = await apiClient.post("/posts", post);
        return response.data;
    },

    // Update post
    update: async (id: string, post: Partial<Post>): Promise<Post> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            const index = mockPosts.findIndex((p) => p.id === id);
            if (index === -1) {
                throw new Error("Post not found");
            }
            mockPosts[index] = { ...mockPosts[index], ...post };
            return mockPosts[index];
        }
        const response = await apiClient.put(`/posts/${id}`, post);
        return response.data;
    },

    // Delete post
    delete: async (id: string): Promise<void> => {
        if (USE_MOCK_DATA) {
            await delay(200);
            const index = mockPosts.findIndex((p) => p.id === id);
            if (index === -1) {
                throw new Error("Post not found");
            }
            mockPosts.splice(index, 1);
            return;
        }
        await apiClient.delete(`/posts/${id}`);
    }
};
