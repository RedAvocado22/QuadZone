package com.quadzone.user;

import com.quadzone.global.dto.PagedResponse;
import com.quadzone.user.dto.*;
import com.quadzone.utils.EntityMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "User API", description = "User management API providing comprehensive user operations. " +
        "Includes admin endpoints for user management and public endpoints for user profile management. " +
        "Supports user creation, updates, retrieval, and authentication context.")
public class UserController {
    private final EntityMapper objectMapper;
    private final UserService userService;

    @GetMapping("/admin")
    @Operation(
            summary = "Get all users (Admin)",
            description = "Retrieve a paginated list of all users in the system with optional search functionality for admin users. " +
                    "Supports pagination and search by username, email, or name. Returns user information with roles and status."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved users list with pagination metadata"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PagedResponse<UserResponse>> getUsers(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query to filter users by username, email, or name", example = "john")
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(userService.findUsers(page, size, search));
    }

    @GetMapping("/admin/{id}")
    @Operation(
            summary = "Get user by ID (Admin)",
            description = "Retrieve detailed information about a specific user by their unique identifier for admin users. " +
                    "Returns complete user details including profile information, roles, and account status."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "User not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid user ID format")
    })
    public ResponseEntity<UserAdminResponse> getUserForAdmin(
            @Parameter(description = "Unique identifier of the user", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(userService.findByIdForAdmin(id));
    }

    @PostMapping("/admin")
    @Operation(
            summary = "Create user (Admin)",
            description = "Create a new user account in the system for admin users. " +
                    "Requires user details including username, email, password, and optional role assignment. " +
                    "Returns the created user with its assigned unique identifier."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "409", description = "User with the same username or email already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error during user creation")
    })
    public ResponseEntity<UserResponse> createUser(
            @Parameter(description = "User registration request containing user details", required = true)
            @Valid @RequestBody UserRegisterRequest userRegisterRequest) {
        UserResponse createdUser = userService.createUser(userRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get user by ID",
            description = "Retrieve detailed information about a specific user by their unique identifier. " +
                    "Public endpoint that returns user profile information."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found and returned successfully"),
            @ApiResponse(responseCode = "404", description = "User not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid user ID format")
    })
    public ResponseEntity<UserResponse> getUser(
            @Parameter(description = "Unique identifier of the user", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Update user",
            description = "Update an existing user's information. Allows partial updates - only provided fields will be modified. " +
                    "User must exist in the system. Can update profile information, roles, and account status."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found with the provided ID"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation failed"),
            @ApiResponse(responseCode = "409", description = "Updated username or email already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error during update")
    })
    public ResponseEntity<UserResponse> updateUser(
            @Parameter(description = "Unique identifier of the user to update", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "User update request with fields to modify", required = true)
            @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        try {
            UserResponse updatedUser = userService.updateUser(id, userUpdateRequest);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete user",
            description = "Permanently delete a user account from the system by its unique identifier. " +
                    "This operation is irreversible. Ensure the user has no active orders or critical associations before deletion."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User deleted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found with the provided ID"),
            @ApiResponse(responseCode = "409", description = "User cannot be deleted (has active orders or associations)"),
            @ApiResponse(responseCode = "500", description = "Internal server error during deletion")
    })
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "Unique identifier of the user to delete", example = "1", required = true)
            @PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/me")
    @Operation(
            summary = "Get current authenticated user",
            description = "Retrieve information about the currently authenticated user based on the JWT token. " +
                    "Returns the user's profile information, roles, and account status. Requires valid authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Current user information returned successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - invalid or missing authentication token"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<CurrentUserResponse> getCurrentUser(
            @Parameter(description = "Authenticated user from security context", hidden = true)
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(objectMapper.toCurrentUserResponse(user));
    }

    @GetMapping("/role/{role}")
    @Operation(
            summary = "Get users by role",
            description = "Retrieve a list of all users with a specific role. " +
                    "Useful for getting lists of shippers, staff, etc. for assignment operations. " +
                    "Returns a simple list without pagination."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved users list"),
            @ApiResponse(responseCode = "400", description = "Invalid role"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<UserResponse>> getUsersByRole(
            @Parameter(description = "User role to filter by", example = "SHIPPER", required = true)
            @PathVariable String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            List<UserResponse> users = userService.getUsersByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
