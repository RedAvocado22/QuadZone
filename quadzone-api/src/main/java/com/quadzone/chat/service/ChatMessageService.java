package com.quadzone.chat.service;

import com.quadzone.chat.dto.ChatMessageRequest;
import com.quadzone.chat.dto.ChatMessageResponse;
import com.quadzone.chat.entity.ChatMessage;
import com.quadzone.chat.entity.ChatMessage.MessageType;
import com.quadzone.chat.entity.ChatRoom;
import com.quadzone.chat.exception.ChatRoomNotFoundException;
import com.quadzone.chat.repository.ChatMessageRepository;
import com.quadzone.chat.repository.ChatRoomRepository;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatMessageService {
    
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Save a new message
     */
    public ChatMessageResponse saveMessage(ChatMessageRequest request) {
        ChatRoom chatRoom = chatRoomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found"));
        
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(request.getContent())
                .messageType(MessageType.TEXT)
                .read(false)
                .build();
        
        message = chatMessageRepository.save(message);
        
        // Update chat room's last message time
        chatRoom.setLastMessageAt(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);
        
        log.info("Saved message {} in room {} from user {}", 
                message.getId(), request.getRoomId(), request.getSenderId());
        
        // Convert to response DTO
        ChatMessageResponse response = ChatMessageResponse.from(message);
        
        // Broadcast message to all subscribers of this chat room
        broadcastMessage(request.getRoomId(), response);
        
        return response;
    }
    
    /**
     * Save a system message (auto-greeting, notifications)
     */
    public ChatMessageResponse saveSystemMessage(Long roomId, String content) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found"));
        
        // For system messages, we can use a system user or leave sender as null
        // Here we'll create the message with a system flag
        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(null) // No specific sender for system messages
                .content(content)
                .messageType(MessageType.SYSTEM)
                .read(false)
                .build();
        
        message = chatMessageRepository.save(message);
        
        log.info("Saved system message {} in room {}", message.getId(), roomId);
        
        // Convert to response DTO
        ChatMessageResponse response = ChatMessageResponse.from(message);
        
        // Broadcast system message
        broadcastMessage(roomId, response);
        
        return response;
    }
    
    /**
     * Broadcast message to WebSocket subscribers
     */
    private void broadcastMessage(Long roomId, ChatMessageResponse message) {
        String destination = "/queue/messages/" + roomId;
        messagingTemplate.convertAndSend(destination, message);
        log.debug("Broadcasted message to {}", destination);
    }
    
    /**
     * Get message history for a chat room
     */
    public Page<ChatMessageResponse> getMessageHistory(Long roomId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("sentAt").descending());
        Page<ChatMessage> messages = chatMessageRepository.findByChatRoomId(roomId, pageable);
        
        return messages.map(ChatMessageResponse::from);
    }
    
    /**
     * Mark messages as read for a user in a chat room
     */
    public int markMessagesAsRead(Long roomId, Long userId) {
        int updatedCount = chatMessageRepository.markMessagesAsRead(roomId, userId);
        log.info("Marked {} messages as read in room {} for user {}", updatedCount, roomId, userId);
        return updatedCount;
    }
    
    /**
     * Get unread message count for a user in a chat room
     */
    public long getUnreadCount(Long roomId, Long userId) {
        return chatMessageRepository.countUnreadMessages(roomId, userId);
    }
    
    /**
     * Delete all messages in a chat room (for cleanup)
     */
    public void deleteAllMessages(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found"));
        
        chatMessageRepository.deleteByChatRoom(chatRoom);
        log.info("Deleted all messages in chat room {}", roomId);
    }
}
