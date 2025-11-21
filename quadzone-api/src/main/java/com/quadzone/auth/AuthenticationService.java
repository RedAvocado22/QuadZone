package com.quadzone.auth;

import com.quadzone.auth.dto.*;
import com.quadzone.auth.token.Token;
import com.quadzone.auth.token.TokenRepository;
import com.quadzone.config.JwtService;
import com.quadzone.exception.user.*;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
import com.quadzone.user.UserRole;
import com.quadzone.user.UserStatus;
import com.quadzone.utils.email.EmailSenderService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailSenderService emailSenderService;

    public void register(RegisterRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new UserAlreadyExistsException(String.format("User with email %s is already exists.", request.email()));
        });

        if (!request.password().equals(request.confirm_password())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        var user = User.builder()
                .firstName(request.firstname())
                .lastName(request.lastname())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(UserRole.CUSTOMER)
                .status(UserStatus.UNACTIVE)
                .build();

        userRepository.save(user);
        var accessToken = jwtService.generateToken(user);
        emailSenderService.sendAccountActivationEmail(user.getEmail(), accessToken);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByEmail(request.email()).orElseThrow(
                () -> new UserNotExistsException(String.format("User with email %s is not exists!", request.email()))
        );

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new SuspendedAccountException("User account is suspended.");
        }

        if (user.getStatus() == UserStatus.UNACTIVE) {
            // Still authenticate to validate credentials before sending activation email
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
            var accessToken = jwtService.generateToken(user);
            emailSenderService.sendAccountActivationEmail(user.getEmail(), accessToken);
            throw new InactiveAccountException("User account is not activated. Check email.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );
        
        var accessToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, refreshToken);

        return new AuthenticationResponse(accessToken, refreshToken);
    }

    public AuthenticationResponse refreshToken(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Refresh token is missing");
        }

        refreshToken = authHeader.substring(7);

        try {
            userEmail = jwtService.extractUsernameFromRefreshToken(refreshToken);
        } catch (Exception e) {
            throw new IllegalArgumentException("Refresh token is invalid or expired");
        }

        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            var isTokenValidInDb = tokenRepository.findByToken(refreshToken)
                    .map(t -> !t.isRevoked())
                    .orElse(false);

            if (jwtService.validateRefreshToken(refreshToken, user) && isTokenValidInDb) {
                var accessToken = jwtService.generateToken(user);
                return new AuthenticationResponse(accessToken, refreshToken);
            }
        }
        throw new IllegalArgumentException("Invalid refresh token");
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
        if (validUserTokens.isEmpty()) {
            return;
        }
        validUserTokens.forEach(token -> token.setRevoked(true));
        tokenRepository.saveAll(validUserTokens);
    }

    public void activateAccount(ActivateAccountRequest req) {
        try {
            String email = jwtService.extractUsername(req.token());

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (user.getStatus() == UserStatus.SUSPENDED) {
                throw new SuspendedAccountException("User account is suspended.");
            }

            if (user.getStatus() == UserStatus.ACTIVE) {
                throw new InactiveAccountException("User account is active.");
            }
            user.setStatus(UserStatus.ACTIVE);
            userRepository.save(user);

        } catch (ExpiredJwtException e) {
            String email = e.getClaims().getSubject();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            var newToken = jwtService.generateToken(user);
            emailSenderService.sendAccountActivationEmail(user.getEmail(), newToken);

            throw new InvalidTokenException("Activation link is expired. A new one has been sent to your email.");

        } catch (Exception e) {
            throw new InvalidTokenException("Invalid activation token");
        }
    }

    public void forgotPassword(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotExistsException(
                        String.format("User with email %s does not exist!", email)
                ));

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new SuspendedAccountException("User account is suspended.");
        }

        var resetToken = jwtService.generateToken(user);
        emailSenderService.sendAccountResetPasswordEmail(user.getEmail(), resetToken);
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        try {
            String email = jwtService.extractUsername(request.token());
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (user.getStatus() == UserStatus.SUSPENDED) {
                throw new SuspendedAccountException("User account is suspended.");
            }

            user.setPassword(passwordEncoder.encode(request.password()));
            userRepository.save(user);

            revokeAllUserTokens(user);

        } catch (ExpiredJwtException e) {
            throw new InvalidTokenException("Password reset link has expired. Please request a new one.");
        } catch (UsernameNotFoundException e) {
            throw new InvalidTokenException("Invalid password reset token. User not found.");
        } catch (io.jsonwebtoken.JwtException e) {
            throw new InvalidTokenException("Invalid password reset token. " + e.getMessage());
        } catch (Exception e) {
            throw new InvalidTokenException("Invalid password reset token: " + e.getMessage());
        }
    }
}
