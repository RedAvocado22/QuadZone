package com.quadzone.config.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    // Track active WebSocket sessions
    private final Map<String, String> activeUsers = new ConcurrentHashMap<>();
    
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String username = headerAccessor.getFirstNativeHeader("username");
        
        if (username != null && sessionId != null) {
            activeUsers.put(sessionId, username);
            log.info("User connected: {} with session: {}", username, sessionId);
            
            // Notify others about user online status
            broadcastUserStatus(username, true);
        }
    }
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        if (sessionId != null) {
            String username = activeUsers.remove(sessionId);
            if (username != null) {
                log.info("User disconnected: {} with session: {}", username, sessionId);
                
                // Notify others about user offline status
                broadcastUserStatus(username, false);
            }
        }
    }
    
    private void broadcastUserStatus(String username, boolean online) {
        // Create a status message
        Map<String, Object> statusMessage = Map.of(
            "username", username,
            "online", online,
            "timestamp", System.currentTimeMillis()
        );
        
        // Broadcast to a topic that interested users can subscribe to
        messagingTemplate.convertAndSend("/topic/user-status", statusMessage);
    }
    
    public boolean isUserOnline(String username) {
        return activeUsers.containsValue(username);
    }
    
    public int getActiveUserCount() {
        return activeUsers.size();
    }
}
