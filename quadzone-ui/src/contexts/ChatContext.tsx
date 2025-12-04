import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import webSocketService from '../services/websocket';
import { 
    type ChatRoom, 
    type ChatMessage, 
    getChatRoom, 
    getMessageHistory, 
    markMessagesAsRead,
    MessageType,
    ChatRoomStatus,
    type ChatMessageRequest 
} from '../api/chat';
import { useUser } from '../hooks/useUser';

// ==================== Type Definitions ====================

interface ChatContextType {
    // State
    isOpen: boolean;
    isConnected: boolean;
    isLoading: boolean;
    chatRoom: ChatRoom | null;
    messages: ChatMessage[];
    unreadCount: number;
    hasMoreMessages: boolean;
    currentPage: number;
    
    // Actions
    openChat: () => Promise<void>;
    closeChat: () => void;
    sendMessage: (content: string) => void;
    loadMoreMessages: () => Promise<void>;
    markAsRead: () => void;
}

// ==================== Context ====================

const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
    children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    // User context
    const { user } = useUser();
    
    // State
    const [isOpen, setIsOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    
    // Refs
    const subscriptionRef = useRef<string | null>(null);
    const connectionAttempted = useRef(false);
    
    // Get backend URL from environment
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
    const wsUrl = backendUrl.replace('/api/v1', '').replace('http://', '') + '/ws';
    const fullWsUrl = `http://${wsUrl}`;
    
    /**
     * Connect to WebSocket server
     */
    const connectWebSocket = useCallback(async () => {
        if (!user || connectionAttempted.current) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('[Chat] No auth token found');
            return;
        }
        
        try {
            connectionAttempted.current = true;
            
            await webSocketService.connect({
                url: fullWsUrl,
                token,
                getToken: () => {
                    const freshToken = localStorage.getItem('access_token');
                    return freshToken;
                },
                onConnect: () => {
                    setIsConnected(true);
                },
                onDisconnect: () => {
                    setIsConnected(false);
                },
                onError: (error) => {
                    console.error('[Chat] WebSocket error:', error);
                    toast.error('Chat connection error. Please try again later.');
                }
            });
        } catch (error) {
            console.error('[Chat] Failed to connect:', error);
            connectionAttempted.current = false;
        }
    }, [user, fullWsUrl]);
    
    /**
     * Subscribe to chat room messages
     */
    const subscribeToRoom = useCallback((roomId: number) => {
        if (!webSocketService.isConnected() || subscriptionRef.current) return;
        
        const destination = `/queue/messages/${roomId}`;
        
        subscriptionRef.current = webSocketService.subscribe(destination, (message) => {
            // Handle different message types
            if (message.type === 'ROOM_CLOSED') {
                setChatRoom(prev => prev ? { ...prev, status: ChatRoomStatus.CLOSED } : null);
                toast.info('Chat has been closed');
                return;
            }
            
            if (message.type === 'STAFF_ASSIGNED') {
                setChatRoom(prev => prev ? {
                    ...prev,
                    staffId: message.staffId,
                    staffName: message.staffName,
                    status: ChatRoomStatus.ASSIGNED
                } : null);
                toast.success(`Staff ${message.staffName} has joined the chat`);
                return;
            }
            
            if (message.type === 'USER_JOINED' || message.type === 'TYPING') {
                // Handle user status updates if needed
                return;
            }
            
            // Handle regular chat message
            const chatMessage: ChatMessage = {
                id: message.id,
                roomId: message.roomId,
                senderId: message.senderId,
                senderName: message.senderName,
                senderAvatar: message.senderAvatar,
                content: message.content,
                messageType: message.messageType || MessageType.TEXT,
                sentAt: message.sentAt,
                read: false
            };
            
            // Add message to the list (avoid duplicates)
            setMessages(prev => {
                const exists = prev.some(m => m.id === chatMessage.id);
                if (exists) return prev;
                return [chatMessage, ...prev];
            });
            
            // Update unread count if message is from other user
            if (chatMessage.senderId !== user?.id) {
                setUnreadCount(prev => prev + 1);
                
                // Show notification if chat window is not open
                if (!isOpen) {
                    toast.info(`New message from ${chatMessage.senderName}`);
                }
            }
        });
    }, [user, isOpen]);
    
    /**
     * Open chat window
     */
    const openChat = useCallback(async () => {
        setIsOpen(true);
        setIsLoading(true);
        
        try {
            // Get or create chat room
            const room = await getChatRoom();
            setChatRoom(room);
            
            // Load initial message history
            const history = await getMessageHistory(room.id, 0, 20);
            setMessages(history.content.reverse()); // Reverse to show oldest first
            setHasMoreMessages(!history.last);
            setCurrentPage(0);
            
            // Subscribe to room messages
            subscribeToRoom(room.id);
            
            // Mark messages as read
            if (room.unreadCount && room.unreadCount > 0) {
                await markMessagesAsRead(room.id);
                setUnreadCount(0);
            }
            
            // Join the room via WebSocket
            if (webSocketService.isConnected()) {
                webSocketService.sendMessage('/app/chat.join', { roomId: room.id });
            }
        } catch (error) {
            console.error('[Chat] Failed to open chat:', error);
            toast.error('Unable to open chat. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [subscribeToRoom]);
    
    /**
     * Close chat window
     */
    const closeChat = useCallback(() => {
        setIsOpen(false);
        
        // Unsubscribe from room messages
        if (subscriptionRef.current) {
            webSocketService.unsubscribe(subscriptionRef.current);
            subscriptionRef.current = null;
        }
    }, []);
    
    /**
     * Send a message
     */
    const sendMessage = useCallback((content: string) => {
        if (!chatRoom || !user || !content.trim()) return;
        
        if (!webSocketService.isConnected()) {
            toast.error('Chat not connected. Please try again.');
            return;
        }
        
        const messageRequest: ChatMessageRequest = {
            roomId: chatRoom.id,
            senderId: user.id,
            content: content.trim()
        };
        
        // Send via WebSocket
        // Message will be added to UI when received back from server
        // This prevents duplicate messages
        webSocketService.sendMessage('/app/chat.send', messageRequest);
    }, [chatRoom, user]);
    
    /**
     * Load more messages (pagination)
     */
    const loadMoreMessages = useCallback(async () => {
        if (!chatRoom || !hasMoreMessages || isLoading) return;
        
        setIsLoading(true);
        
        try {
            const nextPage = currentPage + 1;
            const history = await getMessageHistory(chatRoom.id, nextPage, 20);
            
            setMessages(prev => [...prev, ...history.content.reverse()]);
            setHasMoreMessages(!history.last);
            setCurrentPage(nextPage);
        } catch (error) {
            console.error('[Chat] Failed to load more messages:', error);
            toast.error('Unable to load more messages');
        } finally {
            setIsLoading(false);
        }
    }, [chatRoom, currentPage, hasMoreMessages, isLoading]);
    
    /**
     * Mark messages as read
     */
    const markAsRead = useCallback(async () => {
        if (!chatRoom || unreadCount === 0) return;
        
        try {
            await markMessagesAsRead(chatRoom.id);
            setUnreadCount(0);
        } catch (error) {
            console.error('[Chat] Failed to mark as read:', error);
        }
    }, [chatRoom, unreadCount]);
    
    // Connect WebSocket when user is authenticated
    useEffect(() => {
        if (user) {
            connectWebSocket();
        }
        
        return () => {
            if (connectionAttempted.current) {
                webSocketService.disconnect();
                connectionAttempted.current = false;
            }
        };
    }, [user, connectWebSocket]);
    
    // Mark messages as read when chat is opened
    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            markAsRead();
        }
    }, [isOpen, unreadCount, markAsRead]);
    
    // Context value
    const value: ChatContextType = {
        // State
        isOpen,
        isConnected,
        isLoading,
        chatRoom,
        messages,
        unreadCount,
        hasMoreMessages,
        currentPage,
        
        // Actions
        openChat,
        closeChat,
        sendMessage,
        loadMoreMessages,
        markAsRead
    };
    
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

/**
 * Custom hook to use chat context
 */
export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
