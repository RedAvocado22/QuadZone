import { useState, useEffect } from "react";
import { getAdminBlogs } from "@/api/blog";
import type { BlogDetailResponse, PagedResponse } from "@/api/types";

// ----------------------------------------------------------------------

interface UseAdminBlogsOptions {
    page?: number;
    size?: number;
    search?: string;
    sortBy?: 'latest' | 'popular' | 'oldest';
    enabled?: boolean;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'All';
}

/**
 * Hook for fetching admin blogs with pagination, search, and status filtering
 * Uses the /admin/blogs endpoint which requires authentication
 *
 * @param options configuration options
 * @returns blogs state and controls
 */
export function useAdminBlogs(options: UseAdminBlogsOptions = {}) {
    const { page = 0, size = 12, search = "", sortBy: initialSortBy = "latest", enabled = true, status: initialStatus = "All" } = options;

    const [blogs, setBlogs] = useState<BlogDetailResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'oldest'>(initialSortBy);
    const [currentStatus, setCurrentStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | "All">(initialStatus);

    useEffect(() => {
        if (!enabled) return;

        const fetchBlogs = async () => {
            setLoading(true);
            setError(null);
            try {
                // Build query parameters, excluding status if it's "All"
                const params: any = {
                    page,
                    size,
                    search,
                    sortBy,
                };
                if (currentStatus !== "All") {
                    params.status = currentStatus;
                }

                const response: PagedResponse<BlogDetailResponse> = await getAdminBlogs(params);

                // Handle PagedResponse format { content, page: { size, number, totalElements, totalPages } }
                const blogsData = response.content || [];
                setBlogs(blogsData);
                setTotal(response.page?.totalElements ?? 0);
                setTotalPages(response.page?.totalPages ?? 0);
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Failed to fetch admin blogs"));
                // Fallback to empty array on error
                setBlogs([]);
                setTotal(0);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [page, size, search, sortBy, currentStatus, enabled]);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                page,
                size,
                search,
                sortBy
            };
            if (currentStatus !== "All") {
                params.status = currentStatus;
            }

            const response: PagedResponse<BlogDetailResponse> = await getAdminBlogs(params);
            setBlogs(response.content || []);
            setTotal(response.page?.totalElements ?? 0);
            setTotalPages(response.page?.totalPages ?? 0);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch admin blogs"));
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
        sortBy,
        setSortBy,
        currentStatus,
        setCurrentStatus,
        refetch
    };
}
