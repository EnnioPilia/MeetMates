package com.example.meetmates.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.exception.ConflictException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.exception.NotFoundException;
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

    /**
     * Crée un refresh token unique pour un utilisateur.
     * (Supprime les anciens pour éviter les doublons)
     */
    @Transactional
    public Token createRefreshToken(User user) {

        // Efface les refresh tokens précédents
        tokenRepository.deleteByUser_IdAndType(user.getId(), TokenType.REFRESH);

        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(7 * 24 * 3600), // 7 jours
                TokenType.REFRESH
        );

        token.setUsed(false);

        Token saved = tokenRepository.save(token);

        log.info("[REFRESH] Nouveau refresh token créé pour user={}", user.getEmail());
        return saved;
    }

    /**
     * Retourne un refresh token valide (non expiré, non utilisé).
     */
    @Transactional(readOnly = true)
    public Token getValidRefreshToken(String tokenString) {

        Token token = tokenRepository.findByTokenWithUser(tokenString)
                .orElseThrow(() -> new NotFoundException(ErrorCode.TOKEN_NOT_FOUND));

        if (token.isUsed()) {
            throw new ConflictException(ErrorCode.TOKEN_INVALID);
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new ConflictException(ErrorCode.TOKEN_EXPIRED);
        }

        return token;
    }

    /**
     * Rotation : invalide l'ancien refresh token et en génère un nouveau.
     */
    @Transactional
    public Token rotateRefreshToken(Token oldToken) {

        oldToken.setUsed(true);
        oldToken.setConfirmedAt(Instant.now());
        tokenRepository.save(oldToken);

        log.info("[REFRESH] Rotation du refresh token pour user={}", oldToken.getUser().getEmail());

        return createRefreshToken(oldToken.getUser());
    }
}
