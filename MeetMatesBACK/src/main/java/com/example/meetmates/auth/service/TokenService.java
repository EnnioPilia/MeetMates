package com.example.meetmates.auth.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.model.TokenType;
import com.example.meetmates.user.model.User;
import com.example.meetmates.auth.repository.TokenRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service pour la gestion générique des tokens (verification, reset, refresh...).
 * Fournit des méthodes pour créer, valider, marquer comme utilisé et supprimer des tokens.
 */
@Slf4j
@Service
public class TokenService {

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    /**
     * Crée un token générique pour un utilisateur.
     * Supprime les anciens tokens du même type pour garder un historique propre.
     *
     * @param user l’utilisateur pour lequel créer le token
     * @param type le type de token (VERIFICATION, PASSWORD_RESET, REFRESH, etc.)
     * @param durationSeconds durée de validité du token en secondes
     * @return le token créé
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

        token.setUsed(false); 

        Token saved = tokenRepository.save(token);

        log.info("Token créé pour user={} type={}", user.getEmail(), type);
        return saved;
    }

    /**
     * Récupère un token et vérifie qu'il est valide.
     * La validation inclut :
     * - existence
     * - non-utilisation
     * - non-expiration
     *
     * @param tokenString la valeur du token
     * @return le token valide
     * @throws ApiException si le token est introuvable, déjà utilisé ou expiré
     */
    @Transactional(readOnly = true)
    public Token getValidToken(String tokenString) {
        Token token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new ApiException(ErrorCode.TOKEN_NOT_FOUND));

        if (Boolean.TRUE.equals(token.isUsed())) {
            log.warn("Tentative d'utilisation d'un token déjà utilisé pour user={} type={}", token.getUser().getEmail(), token.getType());
            throw new ApiException(ErrorCode.TOKEN_INVALID); 
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Tentative d'utilisation d'un token expiré pour user={} type={}", token.getUser().getEmail(), token.getType());
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }

        return token;
    }

    /**
     * Marque un token comme utilisé et enregistre la date de confirmation.
     *
     * @param token le token à marquer comme utilisé
     */
    @Transactional
    public void markTokenAsUsed(Token token) {
        token.setUsed(true);
        token.setConfirmedAt(Instant.now());
        tokenRepository.save(token);

        log.info("Token utilisé pour user={} type={}", token.getUser().getEmail(), token.getType());
    }

    /**
     * Supprime tous les tokens d’un utilisateur pour un type donné.
     *
     * @param userId l’identifiant de l’utilisateur
     * @param type le type de tokens à supprimer
     */
    @Transactional
    public void deleteTokenByUserAndType(UUID userId, TokenType type) {
        tokenRepository.deleteByUser_IdAndType(userId, type);
        log.info("Suppression tokens type={} user={}", type, userId);
    }
}
