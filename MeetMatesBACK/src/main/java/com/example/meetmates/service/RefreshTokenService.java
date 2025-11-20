package com.example.meetmates.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.exception.TokenExpiredException;
import com.example.meetmates.exception.TokenNotFoundException;
import com.example.meetmates.model.Token;
import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.TokenRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class RefreshTokenService {

    private final TokenRepository tokenRepository;

    public RefreshTokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // * Recherche un refresh token avec l'utilisateur chargé (JOIN FETCH)
    public Optional<Token> findByToken(String token) {
        return tokenRepository.findByTokenWithUser(token);
    }

    // * Vérifie si un refresh token est expiré
    public boolean isExpired(Token token) {
        return token.getExpiresAt().isBefore(Instant.now());
    }

    // * Génère un nouveau refresh token 
    public Token createRefreshToken(User user) {
        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(7 * 24 * 3600),
                TokenType.REFRESH
        );

        token.setUsed(false);
        Token saved = tokenRepository.save(token);

        log.info("[REFRESH] Nouveau refresh token créé pour user={}", user.getEmail());

        return saved;
    }

    // * Valide un refresh token existant
    public Token validateRefreshToken(String tokenString) {
        Token token = tokenRepository.findByTokenWithUser(tokenString)
                .orElseThrow(() -> new TokenNotFoundException("Refresh token invalide"));

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new TokenExpiredException("Refresh token expiré");
        }

        return token;
    }

    // * Invalide l'ancien refresh token et en génère un nouveau
    public Token rotateToken(Token oldToken) {
        oldToken.setUsed(true);
        tokenRepository.save(oldToken);

        log.info("[REFRESH] Rotation du refresh token pour user={}",
                oldToken.getUser().getEmail());

        return createRefreshToken(oldToken.getUser());
    }
}
