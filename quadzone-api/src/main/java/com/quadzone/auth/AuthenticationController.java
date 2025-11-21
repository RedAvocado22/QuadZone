package com.quadzone.auth;

import com.quadzone.auth.dto.ActivateAccountRequest;
import com.quadzone.auth.dto.AuthenticationRequest;
import com.quadzone.auth.dto.AuthenticationResponse;
import com.quadzone.auth.dto.ForgotPasswordRequest;
import com.quadzone.auth.dto.RegisterRequest;
import com.quadzone.auth.dto.ResetPasswordRequest;
import jakarta.servlet.http.HttpServletRequest;
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
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(authenticationService.refreshToken(request));
    }

    @PostMapping("/activate")
    public ResponseEntity<AuthenticationResponse> activateAccount(@Valid @RequestBody ActivateAccountRequest req) {
        authenticationService.activateAccount(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request.email());
        return ResponseEntity.ok("Password reset link sent to your email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }
}
