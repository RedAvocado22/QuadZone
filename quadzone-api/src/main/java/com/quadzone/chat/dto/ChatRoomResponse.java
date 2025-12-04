package com.quadzone.chat.dto;

import com.quadzone.chat.entity.ChatRoom;
import com.quadzone.chat.entity.ChatRoom.ChatRoomStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long staffId;
    private String staffName;
    private ChatRoomStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;
    private LocalDateTime lastMessageAt;
    private Long unreadCount;
    
    public static ChatRoomResponse from(ChatRoom chatRoom) {
        return ChatRoomResponse.builder()
                .id(chatRoom.getId())
                .customerId(chatRoom.getCustomer().getId())
                .customerName(chatRoom.getCustomer().getFirstName() + " " + chatRoom.getCustomer().getLastName())
                .customerEmail(chatRoom.getCustomer().getEmail())
                .staffId(chatRoom.getStaff() != null ? chatRoom.getStaff().getId() : null)
                .staffName(chatRoom.getStaff() != null ? 
                        chatRoom.getStaff().getFirstName() + " " + chatRoom.getStaff().getLastName() : null)
                .status(chatRoom.getStatus())
                .createdAt(chatRoom.getCreatedAt())
                .closedAt(chatRoom.getClosedAt())
                .lastMessageAt(chatRoom.getLastMessageAt())
                .build();
    }
}
