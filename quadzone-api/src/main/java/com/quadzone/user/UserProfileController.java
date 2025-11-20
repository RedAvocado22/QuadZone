package com.quadzone.user;

import com.quadzone.user.dto.UserProfileDTO;
import com.quadzone.user.dto.UserProfileRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserService userService;
    @GetMapping
    public ResponseEntity<UserProfileDTO> getMyProfile(@AuthenticationPrincipal User user) {
        UserProfileDTO profileDTO = userService.getUserProfile(user.getId());
        return ResponseEntity.ok(profileDTO);
    }
    @PutMapping
    public ResponseEntity<UserProfileDTO> updateMyProfile(@AuthenticationPrincipal User user,
                                                          @Valid @RequestBody UserProfileRequest request) {
        UserProfileDTO updatedProfile = userService.updateUserProfile(user.getId(), request);
        return ResponseEntity.ok(updatedProfile);
    }
    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@AuthenticationPrincipal User user,
                                         @RequestParam("file") MultipartFile fileData) {
        // TODO: Implement Firebase Cloud Storage upload
        // Reference: https://firebase.google.com/docs/storage/admin/start
        
        return ResponseEntity.status(501) // 501 Not Implemented
                .body(java.util.Map.of(
                    "message", "Avatar upload feature is not implemented yet. Will be available with Firebase Cloud Storage.",
                    "timestamp", java.time.LocalDateTime.now()
                ));
    }
}
