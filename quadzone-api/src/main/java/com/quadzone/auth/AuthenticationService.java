package com.quadzone.auth;

import com.quadzone.auth.dto.AuthenticationRequest;
import com.quadzone.auth.dto.AuthenticationResponse;
import com.quadzone.auth.dto.RegisterRequest;
import com.quadzone.auth.token.Token;
import com.quadzone.auth.token.TokenRepository;
import com.quadzone.config.JwtService;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
import com.quadzone.user.UserRole;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
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

    @Value("${spring.application.security.jwt.refresh-token.expiration}")
    private long refreshTokenExpirationMs;

    public AuthenticationResponse register(RegisterRequest request, HttpServletResponse response) {
        if (!request.password().equals(request.confirm_password())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        var user = User.builder()
                .firstName(request.firstname())
                .lastName(request.lastname())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(UserRole.CUSTOMER)
                .build();

        var savedUser = userRepository.save(user);

        var accessToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(savedUser, refreshToken);
        setRefreshTokenCookie(response, refreshToken);

        return new AuthenticationResponse(accessToken);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        var user = userRepository.findByEmail(request.email()).orElseThrow();
        var accessToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, refreshToken);

        setRefreshTokenCookie(response, refreshToken);

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
                .token(jwtToken) // This is now the REFRESH token
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

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);

        cookie.setSecure(false);

        cookie.setPath("/");
        cookie.setMaxAge((int) (refreshTokenExpirationMs / 1000));
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}