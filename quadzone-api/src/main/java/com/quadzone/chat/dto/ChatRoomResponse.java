package com.quadzone.chat.dto;

import com.quadzone.chat.entity.ChatRoom;
import com.quadzone.chat.entity.ChatRoom.ChatRoomStatus;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ChatRoomResponse(
        Long id,
        Long customerId,
        String customerName,
        String customerEmail,
        Long staffId,
        String staffName,
        ChatRoomStatus status,
        LocalDateTime createdAt,
        LocalDateTime closedAt,
        LocalDateTime lastMessageAt,
        Long unreadCount
) {

    public static ChatRoomResponse from(ChatRoom chatRoom) {
        return ChatRoomResponse.builder()
                .id(chatRoom.getId())
                .customerId(chatRoom.getCustomer().getId())
                .customerName(chatRoom.getCustomer().getFirstName() + " " + chatRoom.getCustomer().getLastName())
                .customerEmail(chatRoom.getCustomer().getEmail())
                .staffId(chatRoom.getStaff() != null ? chatRoom.getStaff().getId() : null)
                .staffName(chatRoom.getStaff() != null
                        ? chatRoom.getStaff().getFirstName() + " " + chatRoom.getStaff().getLastName()
                        : null)
                .status(chatRoom.getStatus())
                .createdAt(chatRoom.getCreatedAt())
                .closedAt(chatRoom.getClosedAt())
                .lastMessageAt(chatRoom.getLastMessageAt())
                .build();
    }
}
