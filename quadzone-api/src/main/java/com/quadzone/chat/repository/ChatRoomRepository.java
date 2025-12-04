package com.quadzone.chat.repository;

import com.quadzone.chat.entity.ChatRoom;
import com.quadzone.chat.entity.ChatRoom.ChatRoomStatus;
import com.quadzone.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    /**
     * Find active chat room for a customer
     */
    Optional<ChatRoom> findByCustomerAndStatus(User customer, ChatRoomStatus status);
    
    /**
     * Find chat room by customer ID and status
     */
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.customer.id = :customerId AND cr.status = :status")
    Optional<ChatRoom> findByCustomerIdAndStatus(@Param("customerId") Long customerId, @Param("status") ChatRoomStatus status);
    
    /**
     * Find all chat rooms by status
     */
    Page<ChatRoom> findByStatus(ChatRoomStatus status, Pageable pageable);
    
    /**
     * Find chat rooms assigned to a specific staff
     */
    Page<ChatRoom> findByStaffAndStatus(User staff, ChatRoomStatus status, Pageable pageable);
    
    /**
     * Find chat rooms assigned to a specific staff ID
     */
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.staff.id = :staffId AND cr.status = :status")
    Page<ChatRoom> findByStaffIdAndStatus(@Param("staffId") Long staffId, @Param("status") ChatRoomStatus status, Pageable pageable);
    
    /**
     * Find all active/assigned chat rooms (for staff dashboard)
     */
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.status IN :statuses ORDER BY cr.lastMessageAt DESC, cr.createdAt DESC")
    Page<ChatRoom> findByStatusIn(@Param("statuses") List<ChatRoomStatus> statuses, Pageable pageable);
    
    /**
     * Count unassigned active chat rooms
     */
    long countByStatus(ChatRoomStatus status);
    
    /**
     * Find chat room by ID with messages eagerly loaded
     */
    @Query("SELECT cr FROM ChatRoom cr LEFT JOIN FETCH cr.messages WHERE cr.id = :id")
    Optional<ChatRoom> findByIdWithMessages(@Param("id") Long id);
}
