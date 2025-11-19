package com.quadzone.auth;

import com.quadzone.auth.dto.ActivateAccountRequest;
import com.quadzone.auth.dto.AuthenticationRequest;
import com.quadzone.auth.dto.AuthenticationResponse;
import com.quadzone.auth.dto.RegisterRequest;
import com.quadzone.auth.token.Token;
import com.quadzone.auth.token.TokenRepository;
import com.quadzone.config.JwtService;
import com.quadzone.exception.user.*;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
import com.quadzone.user.UserRole;
import com.quadzone.user.UserStatus;
import com.quadzone.utils.email.EmailSenderService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;

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

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        var user = userRepository.findByEmail(request.email()).orElseThrow(
                () -> new UserNotExistsException(String.format("User with email %s is not exists!", request.email()))
        );

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new SuspendedAccountException("User account is suspended.");
        }

        var accessToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        if (user.getStatus() == UserStatus.UNACTIVE) {
            emailSenderService.sendAccountActivationEmail(user.getEmail(), accessToken);
            throw new InactiveAccountException("User account is not activated. Check email.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        revokeAllUserTokens(user);
        saveUserToken(user, refreshToken);

        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);

        response.addCookie(cookie);

        return new AuthenticationResponse(accessToken);
    }

    public AuthenticationResponse refreshToken(HttpServletRequest request) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            refreshToken = Arrays.stream(request.getCookies())
                    .filter(c -> c.getName().equals("refresh_token"))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Refresh token not found in cookie"));
        }

        if (refreshToken == null) {
            throw new IllegalArgumentException("Refresh token is missing");
        }

        final String userEmail;
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

                return new AuthenticationResponse(accessToken);
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
        validUserTokens.forEach(token -> {
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void activateAccount(ActivateAccountRequest req) {
        String email = jwtService.extractUsername(req.token());
        if (email == null) {
            throw new InvalidTokenException("Invalid token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        String.format("User with email %s does not exists.", email))
                );

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new SuspendedAccountException("User account is suspended.");
        }

        if (jwtService.isTokenExpired(req.token())) {
            emailSenderService.sendAccountActivationEmail(user.getEmail(), jwtService.generateToken(user));
            throw new InvalidTokenException("Activation link is expired. Check email.");
        }

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }
}