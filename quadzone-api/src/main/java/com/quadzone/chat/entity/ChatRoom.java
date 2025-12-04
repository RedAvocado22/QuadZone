package com.quadzone.chat.entity;

import com.quadzone.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_room")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private User staff;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatRoomStatus status;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "closed_at")
    private LocalDateTime closedAt;
    
    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;
    
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sentAt DESC")
    private List<ChatMessage> messages = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = ChatRoomStatus.ACTIVE;
        }
    }
    
    public void closeRoom() {
        this.status = ChatRoomStatus.CLOSED;
        this.closedAt = LocalDateTime.now();
    }
    
    public void assignStaff(User staffUser) {
        this.staff = staffUser;
        this.status = ChatRoomStatus.ASSIGNED;
    }
    
    public enum ChatRoomStatus {
        ACTIVE,
        ASSIGNED,
        CLOSED
    }
}
