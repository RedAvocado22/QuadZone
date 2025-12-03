package com.quadzone.config;

import com.quadzone.config.websocket.JwtHandshakeInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;
    private final JwtChannelInterceptor jwtChannelInterceptor;
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker
        // Messages sent to destinations starting with "/queue" or "/topic" will be handled by the broker
        config.enableSimpleBroker("/queue", "/topic");
        
        // Set the application destination prefix
        // Messages sent to destinations starting with "/app" will be routed to @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");
        
        // Set user destination prefix for sending messages to specific users
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the WebSocket endpoint at "/ws"
        // SockJS fallback will be enabled for browsers that don't support WebSocket
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*", "https://*.quadzone.com")
                .addInterceptors(jwtHandshakeInterceptor)
                .withSockJS();
        
        // Also register endpoint without SockJS for native WebSocket clients
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*", "https://*.quadzone.com")
                .addInterceptors(jwtHandshakeInterceptor);
    }
    
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Add JWT interceptor to validate tokens on every message
        registration.interceptors(jwtChannelInterceptor);
    }
}
