package com.quadzone.user;

import com.quadzone.global.dto.PagedResponse;
import com.quadzone.user.dto.CurrentUserResponse;
import com.quadzone.user.dto.UserRegisterRequest;
import com.quadzone.user.dto.UserResponse;
import com.quadzone.user.dto.UserUpdateRequest;
import com.quadzone.utils.EntityMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "User API", description = "API for managing users")
public class UserController {
    private final EntityMapper objectMapper;
    private final UserService userService;

    // Admin endpoints
    @GetMapping("/admin")
    @Operation(summary = "Get all users (Admin)", description = "Get all users with pagination and search")
    @ApiResponse(responseCode = "200", description = "Users returned")
    public ResponseEntity<PagedResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(userService.findUsers(page, size, search));
    }

    @GetMapping("/admin/{id}")
    @Operation(summary = "Get user by ID (Admin)", description = "Get a user by ID for admin")
    @ApiResponse(responseCode = "200", description = "User returned")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserResponse> getUserForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findByIdForAdmin(id));
    }

    @PostMapping("/admin")
    @Operation(summary = "Create user (Admin)", description = "Create a new user for admin")
    @ApiResponse(responseCode = "201", description = "User created")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "409", description = "User already exists")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRegisterRequest userRegisterRequest) {
        UserResponse createdUser = userService.createUser(userRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // Regular endpoints
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Get a user by ID")
    @ApiResponse(responseCode = "200", description = "User returned")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Update an existing user")
    @ApiResponse(responseCode = "200", description = "User updated")
    @ApiResponse(responseCode = "404", description = "User not found")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "409", description = "User already exists")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        try {
            UserResponse updatedUser = userService.updateUser(id, userUpdateRequest);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Delete a user by ID")
    @ApiResponse(responseCode = "204", description = "User deleted")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get the currently authenticated user")
    @ApiResponse(responseCode = "200", description = "User returned")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(objectMapper.toCurrentUserResponse(user));
    }
}
