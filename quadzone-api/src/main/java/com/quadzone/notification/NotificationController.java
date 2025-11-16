package com.quadzone.notification;

import com.quadzone.notification.dto.NotificationRequest;
import com.quadzone.notification.dto.NotificationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.quadzone.user.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Notification API", description = "API for managing notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get all notifications", description = "Get all notifications for the current user")
    @ApiResponse(responseCode = "200", description = "Notifications returned")
    public ResponseEntity<Map<String, Object>> getAllNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer page,
                         @RequestParam(required = false) Integer size) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (page != null && size != null) {
            Page<NotificationResponse> notifications = notificationService.getNotifications(user.getId(), page, size);
            Map<String, Object> response = new HashMap<>();
            response.put("data", notifications.getContent());
            response.put("total", notifications.getTotalElements());
            response.put("page", notifications.getNumber());
            response.put("pageSize", notifications.getSize());
            return ResponseEntity.ok(response);
        } else {
            List<NotificationResponse> notifications = notificationService.getAllNotifications(user.getId());
            Map<String, Object> response = new HashMap<>();
            response.put("data", notifications);
            response.put("total", notifications.size());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count", description = "Get count of unread notifications for the current user")
    @ApiResponse(responseCode = "200", description = "Unread count returned")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        long count = notificationService.getUnreadCount(user.getId());
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create notification", description = "Create a new notification")
    @ApiResponse(responseCode = "201", description = "Notification created")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<NotificationResponse> createNotification(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody NotificationRequest request) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        NotificationResponse createdNotification = notificationService.createNotification(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNotification);
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark notification as read", description = "Mark a notification as read")
    @ApiResponse(responseCode = "200", description = "Notification marked as read")
    @ApiResponse(responseCode = "404", description = "Notification not found")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read", description = "Mark all notifications as read for the current user")
    @ApiResponse(responseCode = "200", description = "All notifications marked as read")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete notification", description = "Delete a notification")
    @ApiResponse(responseCode = "204", description = "Notification deleted")
    @ApiResponse(responseCode = "404", description = "Notification not found")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        notificationService.deleteNotification(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}

