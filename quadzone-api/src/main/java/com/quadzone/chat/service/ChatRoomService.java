package com.quadzone.chat.service;

import com.quadzone.chat.dto.ChatRoomResponse;
import com.quadzone.chat.entity.ChatRoom;
import com.quadzone.chat.entity.ChatRoom.ChatRoomStatus;
import com.quadzone.chat.exception.ChatRoomNotFoundException;
import com.quadzone.chat.repository.ChatRoomRepository;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
import com.quadzone.user.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatRoomService {
    
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final ChatMessageService chatMessageService;
    
    /**
     * Create or get existing active chat room for a customer
     */
    public ChatRoomResponse createOrGetChatRoom(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // Check if customer already has an active/assigned chat room
        Optional<ChatRoom> existingRoom = chatRoomRepository
                .findByCustomerIdAndStatus(customerId, ChatRoomStatus.ACTIVE);
        
        if (existingRoom.isEmpty()) {
            existingRoom = chatRoomRepository
                    .findByCustomerIdAndStatus(customerId, ChatRoomStatus.ASSIGNED);
        }
        
        if (existingRoom.isPresent()) {
            log.info("Found existing chat room {} for customer {}", existingRoom.get().getId(), customerId);
            return ChatRoomResponse.from(existingRoom.get());
        }
        
        // Create new chat room
        ChatRoom chatRoom = ChatRoom.builder()
                .customer(customer)
                .status(ChatRoomStatus.ACTIVE)
                .build();
        
        chatRoom = chatRoomRepository.save(chatRoom);
        log.info("Created new chat room {} for customer {}", chatRoom.getId(), customerId);
        
        // Send auto-greeting message
        sendAutoGreeting(chatRoom);
        
        // Try to auto-assign staff if available
        autoAssignStaff(chatRoom);
        
        return ChatRoomResponse.from(chatRoom);
    }
    
    /**
     * Send automatic greeting message when chat room is created
     */
    private void sendAutoGreeting(ChatRoom chatRoom) {
        String greetingMessage = "Hello! Thank you for contacting us. " +
                "A support staff will respond to you shortly. " +
                "How can we help you today?";
        
        // Create a system message (sender = null or system user)
        chatMessageService.saveSystemMessage(chatRoom.getId(), greetingMessage);
    }
    
    /**
     * Automatically assign an available staff to the chat room
     */
    private void autoAssignStaff(ChatRoom chatRoom) {
        // Find available staff (STAFF or ADMIN role)
        List<User> availableStaff = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.STAFF || user.getRole() == UserRole.ADMIN)
                .toList();
        
        if (!availableStaff.isEmpty()) {
            // Simple assignment: pick the first available staff
            // In production, implement a more sophisticated algorithm
            // (e.g., round-robin, least busy, skill-based routing)
            User assignedStaff = availableStaff.get(0);
            assignStaff(chatRoom.getId(), assignedStaff.getId());
            log.info("Auto-assigned staff {} to chat room {}", assignedStaff.getId(), chatRoom.getId());
        }
    }
    
    /**
     * Assign a staff member to a chat room
     */
    public ChatRoomResponse assignStaff(Long roomId, Long staffId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found"));
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        // Verify user has STAFF or ADMIN role
        if (staff.getRole() != UserRole.STAFF && staff.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("User is not a staff member");
        }
        
        chatRoom.assignStaff(staff);
        chatRoom = chatRoomRepository.save(chatRoom);
        
        log.info("Assigned staff {} to chat room {}", staffId, roomId);
        return ChatRoomResponse.from(chatRoom);
    }
    
    /**
     * Close a chat room
     */
    public ChatRoomResponse closeChatRoom(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found"));
        
        chatRoom.closeRoom();
        chatRoom = chatRoomRepository.save(chatRoom);
        
        log.info("Closed chat room {}", roomId);
        return ChatRoomResponse.from(chatRoom);
    }
    
    /**
     * Get chat room by ID
     */
    public ChatRoomResponse getChatRoom(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found"));
        
        return ChatRoomResponse.from(chatRoom);
    }
    
    /**
     * Get all chat rooms (for staff dashboard)
     * Returns all chat rooms including CLOSED for history viewing
     */
    public Page<ChatRoomResponse> getAllChatRooms(Pageable pageable) {
        List<ChatRoomStatus> allStatuses = List.of(ChatRoomStatus.ACTIVE, ChatRoomStatus.ASSIGNED, ChatRoomStatus.CLOSED);
        Page<ChatRoom> chatRooms = chatRoomRepository.findByStatusIn(allStatuses, pageable);
        
        return chatRooms.map(ChatRoomResponse::from);
    }
    
    /**
     * Get chat rooms assigned to a specific staff
     */
    public Page<ChatRoomResponse> getStaffChatRooms(Long staffId, Pageable pageable) {
        Page<ChatRoom> chatRooms = chatRoomRepository
                .findByStaffIdAndStatus(staffId, ChatRoomStatus.ASSIGNED, pageable);
        
        return chatRooms.map(ChatRoomResponse::from);
    }
    
    /**
     * Update last message timestamp
     */
    public void updateLastMessageTime(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found"));
        
        chatRoom.setLastMessageAt(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);
    }
    
    /**
     * Validate if a user has access to a chat room
     */
    public boolean hasAccess(Long roomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ChatRoomNotFoundException("Chat room not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Customer can access their own chat room
        if (chatRoom.getCustomer().getId().equals(userId)) {
            return true;
        }
        
        // Assigned staff can access the chat room
        if (chatRoom.getStaff() != null && chatRoom.getStaff().getId().equals(userId)) {
            return true;
        }
        
        // Admin can access all chat rooms
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }
        
        // Unassigned staff can access active rooms (to help customers)
        if (user.getRole() == UserRole.STAFF && chatRoom.getStatus() == ChatRoomStatus.ACTIVE) {
            return true;
        }
        
        return false;
    }
}
