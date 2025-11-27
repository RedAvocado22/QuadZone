package com.quadzone.user;

import com.quadzone.upload.service.ImgbbService;
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
    private final ImgbbService imgbbService;
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
        try {
            if (fileData.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("message", "File is empty"));
            }

            String contentType = fileData.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("message", "File must be an image"));
            }

            ImgbbService.ImgbbUploadResponse imgbbResponse = imgbbService.uploadImage(fileData);
            
            UserProfileDTO updatedProfile = userService.updateUserAvatar(user.getId(), imgbbResponse.getUrl());
            
            return ResponseEntity.ok(updatedProfile);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(java.util.Map.of(
                        "message", "Failed to upload avatar: " + e.getMessage(),
                        "timestamp", java.time.LocalDateTime.now()
                    ));
        }
    }
}
