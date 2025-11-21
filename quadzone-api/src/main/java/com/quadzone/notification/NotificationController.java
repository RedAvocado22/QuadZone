package com.quadzone.notification;

import com.quadzone.notification.dto.NotificationRequest;
import com.quadzone.notification.dto.NotificationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@Tag(name = "Notification API", description = "Notification management API for user notifications. " +
        "Provides comprehensive notification operations including retrieval, creation, read status management, and deletion. " +
        "All operations are scoped to the authenticated user's notifications.")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(
            summary = "Get all notifications",
            description = "Retrieve all notifications for the authenticated user. " +
                    "Supports both paginated and non-paginated responses. " +
                    "If page and size parameters are provided, returns paginated results. " +
                    "Otherwise, returns all notifications for the user. " +
                    "Notifications are sorted by creation date (newest first)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved notifications list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - invalid or missing authentication token"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Map<String, Object>> getAllNotifications(
            @Parameter(description = "Authenticated user from security context", hidden = true)
            @AuthenticationPrincipal User user,
            @Parameter(description = "Page number for pagination (0-indexed). If provided, size must also be provided", example = "0")
            @RequestParam(required = false) Integer page,
            @Parameter(description = "Number of items per page. If provided, page must also be provided", example = "10")
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
    @Operation(
            summary = "Get unread notification count",
            description = "Retrieve the count of unread notifications for the authenticated user. " +
                    "Useful for displaying notification badges or indicators in the UI. " +
                    "Returns a count of all notifications that have not been marked as read."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved unread notification count"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - invalid or missing authentication token"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @Parameter(description = "Authenticated user from security context", hidden = true)
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        long count = notificationService.getUnreadCount(user.getId());
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(
            summary = "Create notification",
            description = "Create a new notification for the authenticated user. " +
                    "Requires notification details including title, message, type, and optional link. " +
                    "Notifications are automatically associated with the authenticated user. " +
                    "Returns the created notification with its assigned unique identifier."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Notification created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - invalid or missing authentication token"),
            @ApiResponse(responseCode = "500", description = "Internal server error during notification creation")
    })
    public ResponseEntity<NotificationResponse> createNotification(
            @Parameter(description = "Authenticated user from security context", hidden = true)
            @AuthenticationPrincipal User user,
            @Parameter(description = "Notification request containing notification details", required = true)
            @Valid @RequestBody NotificationRequest request) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        NotificationResponse createdNotification = notificationService.createNotification(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNotification);
    }

    @PutMapping("/{id}/read")
    @Operation(
            summary = "Mark notification as read",
            description = "Mark a specific notification as read for the authenticated user. " +
                    "The notification must belong to the authenticated user. " +
                    "Once marked as read, the notification will no longer appear in unread counts."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification marked as read successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - invalid or missing authentication token"),
            @ApiResponse(responseCode = "404", description = "Notification not found or does not belong to the user"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> markAsRead(
            @Parameter(description = "Unique identifier of the notification to mark as read", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "Authenticated user from security context", hidden = true)
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    @Operation(
            summary = "Mark all notifications as read",
            description = "Mark all unread notifications as read for the authenticated user in a single operation. " +
                    "Useful for bulk read operations. All notifications belonging to the authenticated user will be marked as read."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All notifications marked as read successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - invalid or missing authentication token"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> markAllAsRead(
            @Parameter(description = "Authenticated user from security context", hidden = true)
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete notification",
            description = "Permanently delete a notification from the system. " +
                    "The notification must belong to the authenticated user. " +
                    "This operation is irreversible and cannot be undone."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Notification deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - invalid or missing authentication token"),
            @ApiResponse(responseCode = "404", description = "Notification not found or does not belong to the user"),
            @ApiResponse(responseCode = "500", description = "Internal server error during deletion")
    })
    public ResponseEntity<Void> deleteNotification(
            @Parameter(description = "Unique identifier of the notification to delete", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "Authenticated user from security context", hidden = true)
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        notificationService.deleteNotification(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
