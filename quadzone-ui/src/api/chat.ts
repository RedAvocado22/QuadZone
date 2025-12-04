import API from './base';

// ==================== Type Definitions ====================
// @ts-ignore
export enum ChatRoomStatus {
    ACTIVE = 'ACTIVE',
    ASSIGNED = 'ASSIGNED',
    CLOSED = 'CLOSED'
}

// @ts-ignore
export enum MessageType {
    TEXT = 'TEXT',
    SYSTEM = 'SYSTEM',
    FILE = 'FILE',
    IMAGE = 'IMAGE'
}

export interface ChatRoom {
    id: number;
    customerId: number;
    customerName: string;
    customerEmail: string;
    staffId?: number;
    staffName?: string;
    status: ChatRoomStatus;
    createdAt: string;
    closedAt?: string;
    lastMessageAt?: string;
    unreadCount?: number;
}

export interface ChatMessage {
    id: number;
    roomId: number;
    senderId?: number;
    senderName: string;
    senderAvatar?: string;
    content: string;
    messageType: MessageType;
    sentAt: string;
    read: boolean;
}

export interface ChatMessageRequest {
    roomId: number;
    senderId: number;
    content: string;
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// ==================== API Functions ====================

/**
 * Get or create chat room for current user
 */
export const getChatRoom = async (): Promise<ChatRoom> => {
    const response = await API.get<ChatRoom>('/chat/room');
    return response.data;
};

/**
 * Get chat room by ID
 */
export const getChatRoomById = async (roomId: number): Promise<ChatRoom> => {
    const response = await API.get<ChatRoom>(`/chat/room/${roomId}`);
    return response.data;
};

/**
 * Get message history for a chat room
 */
export const getMessageHistory = async (
    roomId: number,
    page = 0,
    size = 20
): Promise<PagedResponse<ChatMessage>> => {
    const response = await API.get<PagedResponse<ChatMessage>>(
        `/chat/room/${roomId}/messages`,
        {
            params: { page, size }
        }
    );
    return response.data;
};

/**
 * Get all active chat rooms (for staff/admin)
 */
export const getAllActiveChatRooms = async (
    page = 0,
    size = 20
): Promise<PagedResponse<ChatRoom>> => {
    const response = await API.get<PagedResponse<ChatRoom>>(
        '/chat/rooms',
        {
            params: { page, size }
        }
    );
    return response.data;
};

/**
 * Close a chat room
 */
export const closeChatRoom = async (roomId: number): Promise<ChatRoom> => {
    const response = await API.post<ChatRoom>(`/chat/room/${roomId}/close`);
    return response.data;
};

/**
 * Assign staff to a chat room (admin only)
 */
export const assignStaff = async (roomId: number, staffId: number): Promise<ChatRoom> => {
    const response = await API.post<ChatRoom>(
        `/chat/room/${roomId}/assign`,
        null,
        {
            params: { staffId }
        }
    );
    return response.data;
};

/**
 * Mark all messages as read in a chat room
 */
export const markMessagesAsRead = async (roomId: number): Promise<{ markedAsRead: number }> => {
    const response = await API.put<{ markedAsRead: number }>(
        `/chat/room/${roomId}/read`
    );
    return response.data;
};

// ==================== Helper Functions ====================

/**
 * Format message timestamp for display
 */
export const formatMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Today: show time only
    if (days === 0) {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Yesterday
    if (days === 1) {
        return `Hôm qua ${date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }
    
    // Within a week: show day name
    if (days < 7) {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Older: show full date
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Check if a message is from the current user
 */
export const isOwnMessage = (message: ChatMessage, userId?: number): boolean => {
    return message.senderId === userId;
};

/**
 * Group messages by date for display
 */
export const groupMessagesByDate = (messages: ChatMessage[]): Map<string, ChatMessage[]> => {
    const groups = new Map<string, ChatMessage[]>();
    
    messages.forEach(message => {
        const date = new Date(message.sentAt).toLocaleDateString('vi-VN');
        const group = groups.get(date) || [];
        group.push(message);
        groups.set(date, group);
    });
    
    return groups;
};
