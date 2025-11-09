import apiClient from './axios';

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
    sortBy?: 'latest' | 'popular' | 'oldest';
  }): Promise<PostsResponse> => {
    const response = await apiClient.get('/posts', { params });
    return response.data;
  },

  // Get post by ID
  getById: async (id: string): Promise<Post> => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  // Create post
  create: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const response = await apiClient.post('/posts', post);
    return response.data;
  },

  // Update post
  update: async (id: string, post: Partial<Post>): Promise<Post> => {
    const response = await apiClient.put(`/posts/${id}`, post);
    return response.data;
  },

  // Delete post
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },
};

