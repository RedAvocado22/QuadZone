import { useState, useEffect } from 'react';
import { couponsApi, type Coupon } from 'src/api/coupons';

// ----------------------------------------------------------------------

interface UseCouponsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  enabled?: boolean;
}

export function useCoupons(options: UseCouponsOptions = {}) {
  const { page = 0, pageSize = 10, search = '', enabled = true } = options;

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const fetchCoupons = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await couponsApi.getAll({ page, pageSize, search });
        setCoupons(response.content ?? []);
        setTotal(response.page?.totalElements ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch coupons'));
        setCoupons([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [page, pageSize, search, enabled]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await couponsApi.getAll({ page, pageSize, search });
      setCoupons(response.content ?? []);
      setTotal(response.page?.totalElements ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch coupons'));
    } finally {
      setLoading(false);
    }
  };

  return {
    coupons,
    loading,
    error,
    total,
    refetch,
  };
}

