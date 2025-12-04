// useBlogs.ts
import { useState, useEffect } from "react";
import { getBlogs, type BlogFilterParams } from "@/api/blog";
import type { BlogOverviewResponse } from "@/api/types";

interface UseBlogsOptions extends BlogFilterParams {
    enabled?: boolean;
}

export function useBlogs(options: UseBlogsOptions = {}) {
    const { page = 0, size = 10, search = "", category, sortBy = "latest", enabled = true } = options;

    const [blogs, setBlogs] = useState<BlogOverviewResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [total, setTotal] = useState(0);

    const fetchBlogs = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await getBlogs({
                page,
                size,
                search,
                category,
                sortBy
            });

            setBlogs(res.content);
            setTotal(res.page.totalElements);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch blogs"));
            setBlogs([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!enabled) return;
        fetchBlogs();
    }, [page, size, search, category, sortBy, enabled]);

    return {
        blogs,
        loading,
        error,
        total,
        refetch: fetchBlogs
    };
}
