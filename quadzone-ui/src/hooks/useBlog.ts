// src/hooks/useBlogs.ts
import { useState, useEffect } from 'react';
import { getBlogBySlug, getBlogs, getRecentBlogs, type BlogFilterParams } from '@/api/blog';
import type {BlogOverviewResponse, BlogDetailResponse} from '../api/types';
import type { PagedResponse } from '@/api/types';

export const useBlogs = (params: BlogFilterParams = {}) => {
    const [blogs, setBlogs] = useState<BlogOverviewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
    });

    const fetchBlogs = async (customParams?: BlogFilterParams) => {
        try {
            setLoading(true);
            setError(null);
            const response: PagedResponse<BlogOverviewResponse> = await getBlogs({
                ...params,
                ...customParams,
            });
            setBlogs(response.content);
            setPagination({
                currentPage: response.page.number,
                totalPages: response.page.totalPages,
                totalElements: response.page.totalElements,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [params.page, params.size, params.search, params.category, params.tag]);

    return {
        blogs,
        loading,
        error,
        pagination,
        refetch: fetchBlogs,
    };
};

export const useRecentBlogs = (limit: number = 5) => {
    const [recentBlogs, setRecentBlogs] = useState<BlogOverviewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                setLoading(true);
                const blogs = await getRecentBlogs(limit);
                setRecentBlogs(blogs);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch recent blogs');
                console.error('Error fetching recent blogs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, [limit]);

    return { recentBlogs, loading, error };
};

export const useBlogDetail = (slug: string) => {
    const [blog, setBlog] = useState<BlogDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const blogData = await getBlogBySlug(slug);
                setBlog(blogData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch blog');
                console.error('Error fetching blog detail:', err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    return { blog, loading, error };
};