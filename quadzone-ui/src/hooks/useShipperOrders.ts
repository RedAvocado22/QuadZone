import { useState, useEffect } from 'react';
import { ordersApi, type Order } from 'src/api/orders';

// ----------------------------------------------------------------------

interface UseShipperOrdersOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  enabled?: boolean;
}

export function useShipperOrders(options: UseShipperOrdersOptions = {}) {
  const { page = 0, pageSize = 10, search = '', enabled = true } = options;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ordersApi.getMyAssignedOrders({ page, pageSize, search });
        setOrders(response.content || []);
        setTotal(response.page?.totalElements || 0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
        setOrders([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, pageSize, search, enabled]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
      try {
        const response = await ordersApi.getMyAssignedOrders({ page, pageSize, search });
        setOrders(response.content || []);
        setTotal(response.page?.totalElements || 0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
      } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    total,
    refetch,
  };
}
