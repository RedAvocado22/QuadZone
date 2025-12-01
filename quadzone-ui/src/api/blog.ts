import { API } from './base';
import type { PagedResponse } from './types';
import type { BlogOverviewResponse, BlogDetailResponse } from './types';

export interface BlogFilterParams {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    tag?: string;
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