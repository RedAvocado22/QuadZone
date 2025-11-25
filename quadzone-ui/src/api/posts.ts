import API from "./base";

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
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const response = await API.get<PostsResponse>(`/posts?${queryParams.toString()}`);
    return response.data;
  },

  // Get post by ID
  getById: async (id: string): Promise<Post> => {
    const response = await API.get<Post>(`/posts/${id}`);
    return response.data;
  },

  // Create post
  create: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const response = await API.post<Post>('/posts', post);
    return response.data;
  },

  // Update post
  update: async (id: string, post: Partial<Post>): Promise<Post> => {
    const response = await API.put<Post>(`/posts/${id}`, post);
    return response.data;
  },

  // Delete post
  delete: async (id: string): Promise<void> => {
    await API.delete(`/posts/${id}`);
  },
};
