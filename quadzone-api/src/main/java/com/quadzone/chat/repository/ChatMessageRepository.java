package com.quadzone.chat.repository;

import com.quadzone.chat.entity.ChatMessage;
import com.quadzone.chat.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    /**
     * Find messages by chat room ordered by sent time
     */
    Page<ChatMessage> findByChatRoomOrderBySentAtDesc(ChatRoom chatRoom, Pageable pageable);
    
    /**
     * Find messages by chat room ID
     */
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom.id = :roomId ORDER BY cm.sentAt DESC")
    Page<ChatMessage> findByChatRoomId(@Param("roomId") Long roomId, Pageable pageable);
    
    /**
     * Find unread messages in a chat room for a specific user
     */
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom.id = :roomId AND cm.read = false AND cm.sender.id != :userId")
    List<ChatMessage> findUnreadMessages(@Param("roomId") Long roomId, @Param("userId") Long userId);
    
    /**
     * Count unread messages in a chat room for a specific user
     */
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.chatRoom.id = :roomId AND cm.read = false AND cm.sender.id != :userId")
    long countUnreadMessages(@Param("roomId") Long roomId, @Param("userId") Long userId);
    
    /**
     * Mark messages as read in a chat room for a specific user
     */
    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.read = true WHERE cm.chatRoom.id = :roomId AND cm.sender.id != :userId AND cm.read = false")
    int markMessagesAsRead(@Param("roomId") Long roomId, @Param("userId") Long userId);
    
    /**
     * Get latest message in a chat room
     */
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom.id = :roomId ORDER BY cm.sentAt DESC LIMIT 1")
    ChatMessage findLatestMessage(@Param("roomId") Long roomId);
    
    /**
     * Delete all messages in a chat room
     */
    void deleteByChatRoom(ChatRoom chatRoom);
}
