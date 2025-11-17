package com.quadzone.auth;

import com.quadzone.auth.dto.AuthenticationRequest;
import com.quadzone.auth.dto.AuthenticationResponse;
import com.quadzone.auth.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    //thêm active link qua mail, thêm forget-password, thêm email sender
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        authenticationService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            //Add valid
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request, response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(authenticationService.refreshToken(request));
    }
}