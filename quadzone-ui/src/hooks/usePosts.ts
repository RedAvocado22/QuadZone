import { useState, useEffect } from 'react';
import { postsApi, type Post } from 'src/api/posts';

// ----------------------------------------------------------------------

interface UsePostsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'latest' | 'popular' | 'oldest';
  enabled?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { page = 0, pageSize = 12, search = '', sortBy = 'latest', enabled = true } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postsApi.getAll({ page, pageSize, search, sortBy });
        setPosts(response.data);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
        // Fallback to empty array on error
        setPosts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, pageSize, search, sortBy, enabled]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postsApi.getAll({ page, pageSize, search, sortBy });
      setPosts(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    total,
    refetch,
  };
}

