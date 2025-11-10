import apiClient from './axios';
import { USE_MOCK_DATA } from './config';
import { mockNotifications, delay } from '../_mock/mock-data';

// ----------------------------------------------------------------------

export interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  avatarUrl: string | null;
  postedAt: string | number | null;
  isUnRead: boolean;
}

export interface NotificationsResponse {
  data: Notification[];
  total?: number;
}

// ----------------------------------------------------------------------

export const notificationsApi = {
  // Get all notifications
  getAll: async (): Promise<NotificationsResponse> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return {
        data: mockNotifications,
        total: mockNotifications.length,
      };
    }
    
    const response = await apiClient.get('/notifications');
    const data = response.data;
    
    // Handle different response formats
    // If response is directly an array
    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
      };
    }
    
    // If response is an object with data property
    if (data && typeof data === 'object' && 'data' in data) {
      return {
        data: Array.isArray(data.data) ? data.data : [],
        total: data.total || data.data?.length || 0,
      };
    }
    
    // Default fallback
    return {
      data: [],
      total: 0,
    };
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const notification = mockNotifications.find((n) => n.id === id);
      if (notification) {
        notification.isUnRead = false;
      }
      return;
    }
    await apiClient.put(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      mockNotifications.forEach((n) => {
        n.isUnRead = false;
      });
      return;
    }
    await apiClient.put('/notifications/read-all');
  },
};

