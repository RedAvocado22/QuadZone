import { useState, useEffect } from 'react';
import { getAdminBlogs } from '@/api/blog';
import type { BlogDetailResponse, PagedResponse } from '@/api/types';

// ----------------------------------------------------------------------

interface UseAdminBlogsOptions {
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

/**
 * Hook for fetching admin blogs with pagination and search
 * Uses the /admin/blogs endpoint which requires authentication
 *
 * @param options configuration options
 * @returns blogs state and controls
 */
export function useAdminBlogs(options: UseAdminBlogsOptions = {}) {
  const { page = 0, size = 12, search = '', enabled = true } = options;

  const [blogs, setBlogs] = useState<BlogDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: PagedResponse<BlogDetailResponse> = await getAdminBlogs({
          page,
          size,
          search
        });
        console.log('Admin blogs response:', response);
        // Handle PagedResponse format { content, page: { size, number, totalElements, totalPages } }
        const blogsData = response.content || [];
        console.log('Blogs data:', blogsData);
        setBlogs(blogsData);
        setTotal(response.page?.totalElements ?? 0);
        setTotalPages(response.page?.totalPages ?? 0);
      } catch (err) {
        console.error('Error in useAdminBlogs:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch admin blogs'));
        // Fallback to empty array on error
        setBlogs([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, size, search, enabled]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PagedResponse<BlogDetailResponse> = await getAdminBlogs({
        page,
        size,
        search
      });
      setBlogs(response.content || []);
      setTotal(response.page?.totalElements ?? 0);
      setTotalPages(response.page?.totalPages ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch admin blogs'));
    } finally {
      setLoading(false);
    }
  };

  return {
    blogs,
    loading,
    error,
    total,
    totalPages,
    refetch,
  };
}
