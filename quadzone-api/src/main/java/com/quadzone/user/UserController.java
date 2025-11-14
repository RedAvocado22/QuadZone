package com.quadzone.user;

import com.quadzone.user.dto.CurrentUserResponse;
import com.quadzone.utils.EntityMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/users")
public class UserController {
    private final EntityMapper objectMapper;

    public UserController(EntityMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(objectMapper.toCurrentUserResponse(user));
    }
}
