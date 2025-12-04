import { useState, useEffect, useCallback } from 'react';
import { ordersApi, type Order } from 'src/api/orders';

// ----------------------------------------------------------------------

interface UseMyOrdersOptions {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useMyOrders(options: UseMyOrdersOptions = {}) {
  const { page = 0, pageSize = 10, enabled = true } = options;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await ordersApi.getMyOrders({ page, pageSize });
      setOrders(response.data || []);
      setTotal(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / pageSize));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
      setOrders([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, enabled]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refetch = useCallback(() => {
    return fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    total,
    totalPages,
    refetch,
  };
}

