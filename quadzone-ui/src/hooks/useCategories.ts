import { useState, useEffect } from 'react';
import { categoriesApi, type Category } from 'src/api/categories';

// ----------------------------------------------------------------------

interface UseCategoriesOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  enabled?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { page = 0, pageSize = 10, search = '', sortBy = 'name', sortOrder = 'asc', enabled = true } = options;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoriesApi.getAll({ page, pageSize, search, sortBy, sortOrder });
        setCategories(response.content ?? []);
        setTotal(response.page?.totalElements ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        setCategories([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, pageSize, search, sortBy, sortOrder, enabled]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoriesApi.getAll({ page, pageSize, search, sortBy, sortOrder });
      setCategories(response.content ?? []);
      setTotal(response.page?.totalElements ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    total,
    refetch,
  };
}

