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
public class TokenService {

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    /**
     * Crée un token générique (verification, reset, refresh...). Supprime les
     * anciens tokens du même type pour garder un historique propre.
     */
    @Transactional
    public Token createToken(User user, TokenType type, long durationSeconds) {

        // Supprime les anciens tokens du même type
        tokenRepository.deleteByUser_IdAndType(user.getId(), type);

        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(durationSeconds),
                type
        );

        token.setUsed(false); // même si ton constructeur a déjà false par défaut

        Token saved = tokenRepository.save(token);

        log.info("[TOKEN] Token créé pour user={} type={}", user.getEmail(), type);
        return saved;
    }

    /**
     * Récupère un token et vérifie: - qu'il existe - qu'il n'est pas utilisé -
     * qu'il n'est pas expiré
     */
    @Transactional(readOnly = true)
    public Token getValidToken(String tokenString) {
        Token token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new NotFoundException(ErrorCode.TOKEN_NOT_FOUND));

        if (Boolean.TRUE.equals(token.isUsed())) {
            throw new ConflictException(ErrorCode.TOKEN_INVALID); // ou TOKEN_ALREADY_USED si tu veux
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new ConflictException(ErrorCode.TOKEN_EXPIRED);
        }

        return token;
    }

    /**
     * Marque un token comme utilisé.
     */
    @Transactional
    public void markTokenAsUsed(Token token) {
        token.setUsed(true);
        token.setConfirmedAt(Instant.now());
        tokenRepository.save(token);

        log.info("[TOKEN] Token utilisé pour user={} type={}", token.getUser().getEmail(), token.getType());
    }

    /**
     * Supprime tous les tokens d’un utilisateur pour un type.
     */
    @Transactional
    public void deleteTokenByUserAndType(UUID userId, TokenType type) {
        tokenRepository.deleteByUser_IdAndType(userId, type);
        log.info("[TOKEN] Suppression tokens type={} user={}", type, userId);
    }
}
