import { API } from './base';
import type { PagedResponse, BlogOverviewResponse, BlogDetailResponse, BlogStatus } from './types';

export interface BlogFilterParams {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    sortBy?: 'latest' | 'popular' | 'oldest';
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface CreateBlogRequest {
    title: string;
    content: string;
    thumbnailUrl?: string;
    authorId: number;
}

export interface UpdateBlogRequest {
    title?: string;
    content?: string;
    thumbnailUrl?: string;
    status?: BlogStatus;
}

export interface UpdateBlogStatusRequest {
    status: BlogStatus;
}

/**
 * Fetch all blog posts with pagination
 */
export const getBlogs = async (params: BlogFilterParams = {}): Promise<PagedResponse<BlogOverviewResponse>> => {
    try {
        const response = await API.get('/public/blogs', { params });
        // Backend returns { data, total, page, pageSize }
        // Convert to frontend PagedResponse format { content, page: { size, number, totalElements, totalPages } }
        const backendData = response.data;
        return {
            content: backendData.data || [],
            page: {
                size: backendData.pageSize || 10,
                number: backendData.page || 0,
                totalElements: backendData.total || 0,
                totalPages: Math.ceil((backendData.total || 0) / (backendData.pageSize || 10))
            }
        };
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }
};

/**
 * Fetch single blog post by slug
 */
export const getBlogBySlug = async (slug: string): Promise<BlogDetailResponse> => {
    try {
        const response = await API.get(`/public/blogs/${slug}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching blog with slug ${slug}:`, error);
        throw error;
    }
};

/**
 * Fetch recent blog posts
 */
export const getRecentBlogs = async (limit: number = 5): Promise<BlogOverviewResponse[]> => {
    try {
        const response = await API.get('/public/blog', { 
            params: { page: 0, size: limit } 
        });
        // Backend returns { data, total, page, pageSize }
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching recent blogs:', error);
        throw error;
    }
};

/**
 * Submit a new comment on a blog post
 */
export const submitBlogComment = async (blogId: number, authorName: string, authorEmail: string, content: string): Promise<void> => {
    try {
        await API.post(`/public/blogs/${blogId}/comments`, {
            authorName,
            authorEmail,
            content
        });
    } catch (error) {
        console.error('Error submitting comment:', error);
        throw error;
    }
};

/**
 * Get blog by ID for editing (ADMIN only)
 * 
 * @param id blog ID
 * @returns blog detail
 * @throws error if blog not found or unauthorized
 */
export const getBlogById = async (id: number): Promise<BlogDetailResponse> => {
    try {
        const response = await API.get(`/admin/blogs/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching blog ${id}:`, error);
        throw error;
    }
};

/**
 * Create new blog post (ADMIN only)
 * 
 * @param request blog creation request
 * @returns created blog detail
 * @throws error if validation fails or unauthorized
 */
export const createBlog = async (request: CreateBlogRequest): Promise<BlogDetailResponse> => {
    try {
        const response = await API.post('/admin/blogs', request);
        return response.data;
    } catch (error) {
        console.error('Error creating blog:', error);
        throw error;
    }
};

/**
 * Update existing blog post (ADMIN only)
 * 
 * Supports partial updates - only provided fields will be modified
 * 
 * @param id blog ID
 * @param request blog update request
 * @returns updated blog detail
 * @throws error if blog not found or validation fails
 */
export const updateBlog = async (id: number, request: UpdateBlogRequest): Promise<BlogDetailResponse> => {
    try {
        const response = await API.put(`/admin/blogs/${id}`, request);
        return response.data;
    } catch (error) {
        console.error(`Error updating blog ${id}:`, error);
        throw error;
    }
};

/**
 * Change blog status (ADMIN only)
 * 
 * Updates blog status to DRAFT, PUBLISHED, or ARCHIVED
 * Validates that required fields are present (e.g., featured image for publishing)
 * 
 * @param id blog ID
 * @param status new blog status
 * @returns updated blog detail
 * @throws error if status transition is invalid
 */
export const updateBlogStatus = async (id: number, status: BlogStatus): Promise<BlogDetailResponse> => {
    try {
        const response = await API.patch(`/admin/blogs/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating blog ${id} status:`, error);
        throw error;
    }
};

/**
 * Delete blog post (ADMIN only)
 * 
 * Permanently removes blog from database
 * 
 * @param id blog ID
 * @throws error if blog not found
 */
export const deleteBlog = async (id: number): Promise<void> => {
    try {
        await API.delete(`/admin/blogs/${id}`);
    } catch (error) {
        console.error(`Error deleting blog ${id}:`, error);
        throw error;
    }
};
/**
 * Fetch all blogs for admin (ADMIN only)
 * 
 * @param params pagination and search parameters
 * @returns paginated blog details in frontend PagedResponse format
 */
export const getAdminBlogs = async (params: BlogFilterParams = {}): Promise<PagedResponse<BlogDetailResponse>> => {
    try {
        const response = await API.get('/admin/blogs', { params });
        console.log('getAdminBlogs raw response:', response);
        console.log('getAdminBlogs response.data:', response.data);
        
        // Backend returns: { data: [], total: number, page: number, pageSize: number }
        // Frontend expects: { content: [], page: { size, number, totalElements, totalPages } }
        const { data, total, page, pageSize } = response.data;
        
        const transformedResponse: PagedResponse<BlogDetailResponse> = {
            content: data || [],
            page: {
                size: pageSize || 10,
                number: page || 0,
                totalElements: total || 0,
                totalPages: Math.ceil((total || 0) / (pageSize || 10))
            }
        };
        
        console.log('Transformed response:', transformedResponse);
        return transformedResponse;
    } catch (error) {
        console.error('Error fetching admin blogs:', error);
        throw error;
    }
};
