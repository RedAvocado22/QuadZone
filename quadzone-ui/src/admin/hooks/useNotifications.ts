import { useState, useEffect } from 'react';
import { notificationsApi, type Notification } from 'src/api/notifications';

// ----------------------------------------------------------------------

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await notificationsApi.getAll();
        setNotifications(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
        // Fallback to empty array on error
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationsApi.getAll();
      setNotifications(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isUnRead: false } : notif))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isUnRead: false })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      // Fallback: update locally even if API call fails
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isUnRead: false })));
    }
  };

  return {
    notifications,
    loading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  };
}

