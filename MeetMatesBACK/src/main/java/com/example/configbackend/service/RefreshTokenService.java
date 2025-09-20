package com.example.configbackend.service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.example.configbackend.config.JWTUtils;
import com.example.configbackend.model.Token;
import com.example.configbackend.model.TokenType;
import com.example.configbackend.model.User;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class RefreshTokenService {

    private final TokenService tokenService;
    // private final UserService userService;

    public RefreshTokenService(TokenService tokenService, @Lazy UserService userService) {
        this.tokenService = tokenService;
        // this.userService = userService;
    }

    public Token createRefreshToken(User user) {
        return tokenService.createToken(user, TokenType.REFRESH, 604_800); // 7 jours
    }

    public Optional<Token> findByToken(String token) {
        return tokenService.findByToken(token);
    }

    public void deleteByUser(User user) {
        tokenService.deleteTokenByUserAndType(user.getId(), TokenType.REFRESH);
    }

    public boolean isRefreshTokenExpired(Token token) {
        return token.getExpiresAt() != null && token.getExpiresAt().isBefore(Instant.now());
    }

    public Map<String, String> generateNewAccessTokenFromRefreshToken(HttpServletRequest request, JWTUtils jwtUtils) {
        String refreshTokenString = jwtUtils.extractTokenFromRequest(request);

        Token refreshToken = findByToken(refreshTokenString)
                .orElseThrow(() -> new RuntimeException("Refresh token invalide"));

        if (isRefreshTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expiré");
        }

        User user = refreshToken.getUser();
        String newAccessToken = jwtUtils.generateToken(user.getEmail(), user.getRole());

        return Map.of(
                "accessToken", newAccessToken,
                "refreshToken", refreshToken.getToken()
        );
    }
}
