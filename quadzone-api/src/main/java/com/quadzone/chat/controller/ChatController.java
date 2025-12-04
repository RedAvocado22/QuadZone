package com.quadzone.chat.controller;

import com.quadzone.chat.dto.ChatMessageRequest;
import com.quadzone.chat.dto.ChatMessageResponse;
import com.quadzone.chat.dto.ChatRoomResponse;
import com.quadzone.chat.service.ChatMessageService;
import com.quadzone.chat.service.ChatRoomService;
import com.quadzone.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Chat", description = "Chat management APIs")
public class ChatController {
    
    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    
    // ==================== REST API Endpoints ====================
    
    @GetMapping("/room")
    @Operation(summary = "Get or create chat room for current user")
    public ResponseEntity<ChatRoomResponse> getOrCreateChatRoom(@AuthenticationPrincipal User currentUser) {
        ChatRoomResponse chatRoom = chatRoomService.createOrGetChatRoom(currentUser.getId());
        return ResponseEntity.ok(chatRoom);
    }
    
    @GetMapping("/room/{roomId}")
    @Operation(summary = "Get chat room by ID")
    public ResponseEntity<ChatRoomResponse> getChatRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal User currentUser) {
        
        // Verify user has access to this chat room
        if (!chatRoomService.hasAccess(roomId, currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        ChatRoomResponse chatRoom = chatRoomService.getChatRoom(roomId);
        return ResponseEntity.ok(chatRoom);
    }
    
    @GetMapping("/room/{roomId}/messages")
    @Operation(summary = "Get message history for a chat room")
    public ResponseEntity<Page<ChatMessageResponse>> getMessageHistory(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User currentUser) {
        
        // Verify user has access to this chat room
        if (!chatRoomService.hasAccess(roomId, currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Page<ChatMessageResponse> messages = chatMessageService.getMessageHistory(roomId, page, size);
        
        // Mark messages as read
        chatMessageService.markMessagesAsRead(roomId, currentUser.getId());
        
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/rooms")
    @Operation(summary = "Get all chat rooms (for staff/admin)")
    public ResponseEntity<Page<ChatRoomResponse>> getAllChatRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User currentUser) {
        
        // Only staff and admin can view all chat rooms
        if (!currentUser.getRole().name().equals("STAFF") && !currentUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        
        PageRequest pageable = PageRequest.of(page, size);
        Page<ChatRoomResponse> chatRooms = chatRoomService.getAllChatRooms(pageable);
        return ResponseEntity.ok(chatRooms);
    }
    
    @PostMapping("/room/{roomId}/close")
    @Operation(summary = "Close a chat room")
    public ResponseEntity<ChatRoomResponse> closeChatRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal User currentUser) {
        
        // Verify user has access to close this chat room
        if (!chatRoomService.hasAccess(roomId, currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        ChatRoomResponse chatRoom = chatRoomService.closeChatRoom(roomId);
        
        // Notify via WebSocket that room is closed
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "ROOM_CLOSED");
        notification.put("roomId", roomId);
        messagingTemplate.convertAndSend("/queue/messages/" + roomId, notification);
        
        return ResponseEntity.ok(chatRoom);
    }
    
    @PostMapping("/room/{roomId}/assign")
    @Operation(summary = "Assign staff to a chat room")
    public ResponseEntity<ChatRoomResponse> assignStaff(
            @PathVariable Long roomId,
            @RequestParam Long staffId,
            @AuthenticationPrincipal User currentUser) {
        
        // Only admin can assign staff
        if (!currentUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        
        ChatRoomResponse chatRoom = chatRoomService.assignStaff(roomId, staffId);
        
        // Notify via WebSocket about staff assignment
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "STAFF_ASSIGNED");
        notification.put("roomId", roomId);
        notification.put("staffId", staffId);
        notification.put("staffName", chatRoom.staffName());
        messagingTemplate.convertAndSend("/queue/messages/" + roomId, notification);
        
        return ResponseEntity.ok(chatRoom);
    }
    
    @PutMapping("/room/{roomId}/read")
    @Operation(summary = "Mark all messages as read in a chat room")
    public ResponseEntity<Map<String, Integer>> markMessagesAsRead(
            @PathVariable Long roomId,
            @AuthenticationPrincipal User currentUser) {
        
        // Verify user has access to this chat room
        if (!chatRoomService.hasAccess(roomId, currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        int count = chatMessageService.markMessagesAsRead(roomId, currentUser.getId());
        
        Map<String, Integer> response = new HashMap<>();
        response.put("markedAsRead", count);
        return ResponseEntity.ok(response);
    }
    
    // ==================== WebSocket Message Handlers ====================
    
    /**
     * Handle sending chat messages via WebSocket
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageRequest messageRequest, Principal principal) {
        log.info("Received message from {}: {}", principal.getName(), messageRequest.content());
        
        // The service will handle saving and broadcasting
        ChatMessageResponse savedMessage = chatMessageService.saveMessage(messageRequest);
        
        // The message is already broadcast by the service
        // Update chat room's last message time is also handled by service
    }
    
    /**
     * Handle user joining a chat room
     */
    @MessageMapping("/chat.join")
    public void joinRoom(@Payload Map<String, Long> payload, SimpMessageHeaderAccessor headerAccessor) {
        Long roomId = payload.get("roomId");
        String username = headerAccessor.getUser().getName();
        
        log.info("User {} joined chat room {}", username, roomId);
        
        // Notify other users in the room
        Map<String, Object> joinMessage = new HashMap<>();
        joinMessage.put("type", "USER_JOINED");
        joinMessage.put("username", username);
        joinMessage.put("roomId", roomId);
        
        messagingTemplate.convertAndSend("/queue/messages/" + roomId, joinMessage);
    }
    
    /**
     * Handle typing indicator
     */
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload Map<String, Object> payload) {
        Long roomId = (Long) payload.get("roomId");
        String username = (String) payload.get("username");
        Boolean isTyping = (Boolean) payload.get("isTyping");
        
        Map<String, Object> typingMessage = new HashMap<>();
        typingMessage.put("type", "TYPING");
        typingMessage.put("username", username);
        typingMessage.put("isTyping", isTyping);
        
        messagingTemplate.convertAndSend("/queue/messages/" + roomId, typingMessage);
    }
}
