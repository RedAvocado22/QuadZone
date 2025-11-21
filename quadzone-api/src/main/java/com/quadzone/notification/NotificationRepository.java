package com.quadzone.notification;

import com.quadzone.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserOrderByPostedAtDesc(User user, Pageable pageable);
    List<Notification> findByUserAndIsUnReadTrueOrderByPostedAtDesc(User user);
    long countByUserAndIsUnReadTrue(User user);
}

