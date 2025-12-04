package com.quadzone.chat.entity;

import com.quadzone.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_message")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = true)
    private User sender;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    private MessageType messageType;
    
    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;
    
    @Column(name = "is_read", nullable = false)
    private boolean read;
    
    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
        if (messageType == null) {
            messageType = MessageType.TEXT;
        }
        read = false;
    }
    
    public void markAsRead() {
        this.read = true;
    }
    
    public enum MessageType {
        TEXT,           // Regular text message
        SYSTEM,         // System message (e.g., greeting, notifications)
        FILE,           // File attachment (future feature)
        IMAGE           // Image attachment (future feature)
    }
}
