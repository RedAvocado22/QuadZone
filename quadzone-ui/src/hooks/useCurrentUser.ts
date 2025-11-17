import { useState, useEffect } from 'react';
import { usersApi, type CurrentUser } from '../api/users';

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const currentUser = await usersApi.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch current user');
        setError(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await usersApi.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch current user');
      setError(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, refetch };
}

