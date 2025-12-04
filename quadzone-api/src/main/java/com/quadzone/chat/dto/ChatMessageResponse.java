package com.quadzone.chat.dto;

import com.quadzone.chat.entity.ChatMessage;
import com.quadzone.chat.entity.ChatMessage.MessageType;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ChatMessageResponse(
        Long id,
        Long roomId,
        Long senderId,
        String senderName,
        String senderAvatar,
        String content,
        MessageType messageType,
        LocalDateTime sentAt,
        boolean read
) {

    public static ChatMessageResponse from(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .roomId(message.getChatRoom().getId())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderName(message.getSender() != null
                        ? message.getSender().getFirstName() + " " + message.getSender().getLastName()
                        : "System")
                .senderAvatar(message.getSender() != null ? message.getSender().getAvatarUrl() : null)
                .content(message.getContent())
                .messageType(message.getMessageType())
                .sentAt(message.getSentAt())
                .read(message.isRead())
                .build();
    }
}
