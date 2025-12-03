package com.quadzone.chat.dto;

import com.quadzone.chat.entity.ChatMessage;
import com.quadzone.chat.entity.ChatMessage.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    
    private Long id;
    private Long roomId;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private String content;
    private MessageType messageType;
    private LocalDateTime sentAt;
    private boolean read;
    
    public static ChatMessageResponse from(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .roomId(message.getChatRoom().getId())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderName(message.getSender() != null ? 
                        message.getSender().getFirstName() + " " + message.getSender().getLastName() : "System")
                .senderAvatar(message.getSender() != null ? message.getSender().getAvatarUrl() : null)
                .content(message.getContent())
                .messageType(message.getMessageType())
                .sentAt(message.getSentAt())
                .read(message.isRead())
                .build();
    }
}
