import { useState, useEffect } from 'react';
import { productsApi, type Product } from 'src/api/productsAdmin';

// ----------------------------------------------------------------------

interface UseProductsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  price?: string;
  gender?: string[];
  colors?: string[];
  rating?: string;
  enabled?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const {
    page = 0,
    pageSize = 12,
    search = '',
    category,
    price,
    gender,
    colors,
    rating,
    enabled = true,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productsApi.getAll({
          page,
          pageSize,
          search,
          category,
          price,
          gender,
          colors,
          rating,
        });
        setProducts(response.content ?? []);
        setTotal(response.page?.totalElements ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
        // Fallback to empty array on error
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize, search, category, price, gender, colors, rating, enabled]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getAll({
        page,
        pageSize,
        search,
        category,
        price,
        gender,
        colors,
        rating,
      });
      setProducts(response.content ?? []);
      setTotal(response.page?.totalElements ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    total,
    refetch,
  };
}

