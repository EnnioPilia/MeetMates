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
 * Service pour la gestion des refresh tokens JWT.
 * Permet de créer, valider et faire la rotation des refresh tokens.
 */
@Slf4j
@Service
public class RefreshTokenService {

    private final TokenRepository tokenRepository;

    public RefreshTokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    /**
     * Crée un refresh token unique pour un utilisateur.
     * Supprime les anciens tokens pour éviter les doublons.
     *
     * @param user l’utilisateur pour lequel créer le refresh token
     * @return le refresh token créé
     */
    @Transactional
    public Token createRefreshToken(User user) {

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

        log.info("Nouveau refresh token créé pour user={}", user.getEmail());
        return saved;
    }

    /**
     * Retourne un refresh token valide.
     * Vérifie que le token n’est pas expiré et qu’il n’a pas déjà été utilisé.
     *
     * @param tokenString la valeur du refresh token
     * @return le token valide
     * @throws ApiException si le token est introuvable, expiré ou déjà utilisé
     */
    @Transactional(readOnly = true)
    public Token getValidRefreshToken(String tokenString) {

        Token token = tokenRepository.findByTokenWithUser(tokenString)
                .orElseThrow(() -> new ApiException(ErrorCode.TOKEN_NOT_FOUND));

        if (token.isUsed()) {
            log.warn("Tentative d'utilisation d'un refresh token déjà utilisé pour user={}", token.getUser().getEmail());
            throw new ApiException(ErrorCode.TOKEN_INVALID);
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Tentative d'utilisation d'un refresh token expiré pour user={}", token.getUser().getEmail());
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }

        return token;
    }

    /**
     * Rotation du refresh token.
     * Invalide l’ancien token et en génère un nouveau.
     *
     * @param oldToken le refresh token existant à invalider
     * @return le nouveau refresh token
     */
    @Transactional
    public Token rotateRefreshToken(Token oldToken) {

        oldToken.setUsed(true);
        oldToken.setConfirmedAt(Instant.now());
        tokenRepository.save(oldToken);

        log.info("Rotation du refresh token pour user={}", oldToken.getUser().getEmail());

        return createRefreshToken(oldToken.getUser());
    }
}
