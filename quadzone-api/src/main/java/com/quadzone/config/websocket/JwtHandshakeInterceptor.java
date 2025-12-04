package com.quadzone.config.websocket;

import com.quadzone.config.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
    
    private final JwtService jwtService;
    
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                 WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        
        String token = extractTokenFromRequest(request);
        
        if (token == null) {
            log.warn("No JWT token found in WebSocket handshake request");
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }
        
        try {
            // Extract username from token and validate
            String username = jwtService.extractUsername(token);
            if (username != null) {
                // Store user info in WebSocket session attributes
                attributes.put("username", username);
                attributes.put("token", token);
                log.info("WebSocket handshake successful for user: {}", username);
                return true;
            }
        } catch (Exception e) {
            log.error("JWT validation failed during WebSocket handshake: {}", e.getMessage());
        }
        
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return false;
    }
    
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // No action needed after handshake
        if (exception != null) {
            log.error("WebSocket handshake failed: {}", exception.getMessage());
        }
    }
    
    private String extractTokenFromRequest(ServerHttpRequest request) {
        // Try to get token from query parameter first (common for WebSocket)
        String query = request.getURI().getQuery();
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2 && "token".equals(keyValue[0])) {
                    return keyValue[1];
                }
            }
        }
        
        // Fall back to Authorization header
        var authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        
        return null;
    }
}
