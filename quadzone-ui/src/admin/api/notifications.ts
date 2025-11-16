import API from "../../api/base";

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

interface NotificationDto {
  id: number;
  type: string;
  title: string;
  description: string | null;
  avatarUrl: string | null;
  postedAt: string;
  isUnRead: boolean;
}

function mapNotificationToFrontend(dto: NotificationDto): Notification {
  return {
    id: String(dto.id),
    type: dto.type,
    title: dto.title,
    description: dto.description || '',
    avatarUrl: dto.avatarUrl,
    postedAt: dto.postedAt,
    isUnRead: dto.isUnRead,
  };
}

export const notificationsApi = {
  // Get all notifications
  getAll: async (): Promise<NotificationsResponse> => {
    const response = await API.get<{
      data: NotificationDto[];
      total: number;
    }>('/notifications');
    
    const data = response.data;
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return {
        data: data.map(mapNotificationToFrontend),
        total: data.length,
      };
    }
    
    if (data && typeof data === 'object' && 'data' in data) {
      const notificationsArray = Array.isArray(data.data) ? data.data : [];
      return {
        data: notificationsArray.map(mapNotificationToFrontend),
        total: data.total || notificationsArray.length || 0,
      };
    }
    
    return {
      data: [],
      total: 0,
    };
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<void> => {
    await API.put(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await API.put('/notifications/read-all');
  },
};
