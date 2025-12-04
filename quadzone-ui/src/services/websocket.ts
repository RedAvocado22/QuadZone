import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface WebSocketConfig {
    url: string;
    token: string;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: any) => void;
    getToken?: () => string | null; // Callback to get fresh token
}

export class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, any> = new Map();
    private config: WebSocketConfig | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000; // 3 seconds
    
    constructor() {
        this.client = null;
    }
    
    /**
     * Connect to WebSocket server
     */
    connect(config: WebSocketConfig): Promise<void> {
        this.config = config;
        
        return new Promise((resolve, reject) => {
            // Create STOMP client with SockJS
            this.client = new Client({
                webSocketFactory: () => {
                    // Append token to URL for handshake authentication
                    const url = `${config.url}?token=${encodeURIComponent(config.token)}`;
                    return new SockJS(url) as any;
                },
                connectHeaders: {
                    Authorization: `Bearer ${config.token}`,
                },
                debug: (str) => {
                    console.log('[WebSocket Debug]', str);
                },
                reconnectDelay: this.reconnectDelay,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });
            
            // Set up connection handlers
            this.client.onConnect = (frame) => {
                console.log('[WebSocket] Connected:', frame);
                this.reconnectAttempts = 0;
                
                if (config.onConnect) {
                    config.onConnect();
                }
                
                resolve();
            };
            
            this.client.onDisconnect = (frame) => {
                console.log('[WebSocket] Disconnected:', frame);
                
                if (config.onDisconnect) {
                    config.onDisconnect();
                }
                
                // Attempt reconnection if not manually disconnected
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.attemptReconnect();
                }
            };
            
            this.client.onStompError = (frame) => {
                console.error('[WebSocket] Error:', frame.headers['message']);
                console.error('[WebSocket] Error Body:', frame.body);
                
                if (config.onError) {
                    config.onError(frame);
                }
                
                reject(new Error(frame.headers['message'] || 'WebSocket connection error'));
            };
            
            this.client.onWebSocketError = (error) => {
                console.error('[WebSocket] WebSocket Error:', error);
                
                if (config.onError) {
                    config.onError(error);
                }
            };
            
            // Activate the client (connect)
            this.client.activate();
        });
    }
    
    /**
     * Attempt to reconnect to the server
     */
    private attemptReconnect(): void {
        this.reconnectAttempts++;
        
        console.log(`[WebSocket] Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        
        setTimeout(() => {
            if (this.config && this.client) {
                // Get fresh token before reconnecting
                const freshToken = this.config.getToken ? this.config.getToken() : this.config.token;
                
                if (freshToken) {
                    console.log('[WebSocket] Using fresh token for reconnection');
                    
                    // Update the client with fresh token
                    this.client.configure({
                        webSocketFactory: () => {
                            const url = `${this.config!.url}?token=${encodeURIComponent(freshToken)}`;
                            return new SockJS(url) as any;
                        },
                        connectHeaders: {
                            Authorization: `Bearer ${freshToken}`,
                        },
                    });
                    
                    this.client.activate();
                } else {
                    console.error('[WebSocket] No fresh token available for reconnection');
                }
            }
        }, this.reconnectDelay * this.reconnectAttempts);
    }
    
    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void {
        if (this.client?.connected) {
            // Unsubscribe from all subscriptions
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
            this.subscriptions.clear();
            
            // Deactivate the client
            this.client.deactivate();
            console.log('[WebSocket] Disconnected manually');
        }
    }
    
    /**
     * Subscribe to a destination
     */
    subscribe(destination: string, callback: (message: any) => void): string {
        if (!this.client?.connected) {
            throw new Error('WebSocket is not connected');
        }
        
        const subscription = this.client.subscribe(destination, (message) => {
            try {
                const body = JSON.parse(message.body);
                callback(body);
            } catch (error) {
                console.error('[WebSocket] Failed to parse message:', error);
                callback(message.body);
            }
        });
        
        // Generate unique subscription ID
        const subscriptionId = `sub-${Date.now()}-${Math.random()}`;
        this.subscriptions.set(subscriptionId, subscription);
        
        console.log(`[WebSocket] Subscribed to ${destination}`);
        return subscriptionId;
    }
    
    /**
     * Unsubscribe from a destination
     */
    unsubscribe(subscriptionId: string): void {
        const subscription = this.subscriptions.get(subscriptionId);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionId);
            console.log(`[WebSocket] Unsubscribed from ${subscriptionId}`);
        }
    }
    
    /**
     * Send a message to a destination
     */
    sendMessage(destination: string, body: any, headers: any = {}): void {
        if (!this.client?.connected) {
            throw new Error('WebSocket is not connected');
        }
        
        const messageBody = typeof body === 'string' ? body : JSON.stringify(body);
        
        this.client.publish({
            destination,
            body: messageBody,
            headers,
        });
        
        console.log(`[WebSocket] Sent message to ${destination}:`, body);
    }
    
    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.client?.connected || false;
    }
    
    /**
     * Get the STOMP client instance
     */
    getClient(): Client | null {
        return this.client;
    }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
