package com.quadzone.config;

import com.quadzone.auth.token.TokenRepository;
import com.quadzone.user.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        // Get the authenticated user and revoke all their tokens
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
            if (userDetails instanceof User user) {
                var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
                if (!validUserTokens.isEmpty()) {
                    validUserTokens.forEach(token -> token.setRevoked(true));
                    tokenRepository.saveAll(validUserTokens);
                }
            }
        }

        SecurityContextHolder.clearContext();
    }
}
