import { useState, useEffect } from 'react';
import { usersApi, type User } from 'src/api/users';

// ----------------------------------------------------------------------

interface UseUsersOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  enabled?: boolean;
}

export function useUsers(options: UseUsersOptions = {}) {
  const { page = 0, pageSize = 10, search = '', enabled = true } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getAll({ page, pageSize, search });
        setUsers(response.content ?? []);
        setTotal(response.page?.totalElements ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch users'));
        // Fallback to empty array on error
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, pageSize, search, enabled]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getAll({ page, pageSize, search });
      setUsers(response.content ?? []);
      setTotal(response.page?.totalElements ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    total,
    refetch,
  };
}

