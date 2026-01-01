package com.example.meetmates.common.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.model.TokenType;
import com.example.meetmates.user.model.User;
import com.example.meetmates.auth.repository.TokenRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service pour la gestion de la vérification des comptes utilisateurs.
 * Permet de générer des tokens de vérification et de confirmer les comptes.
 */
@Slf4j
@Service
public class VerificationService {

    private final TokenRepository tokenRepository;

    public VerificationService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    /**
     * Génère un token de vérification pour un utilisateur non vérifié.
     * Supprime les anciens tokens de vérification pour le même utilisateur.
     *
     * @param user l’utilisateur à vérifier
     * @return le token de vérification généré
     * @throws ApiException si l’utilisateur est déjà vérifié
     */
    public String createVerificationToken(User user) {

        if (user.isEnabled()) {
            log.warn("Création token échouée : utilisateur déjà vérifié user={}", user.getEmail());
            throw new ApiException(ErrorCode.USER_ALREADY_VERIFIED);
        }

        tokenRepository.deleteByUser_IdAndType(user.getId(), TokenType.VERIFICATION);

        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(24 * 3600),
                TokenType.VERIFICATION
        );

        tokenRepository.save(token);
        log.info("Token créé pour {}", user.getEmail());

        return token.getToken();
    }

    /**
     * Valide le token de confirmation et active le compte utilisateur.
     * Supprime le token une fois utilisé.
     *
     * @param tokenValue la valeur du token de vérification
     * @throws ApiException si le token est invalide ou expiré
     */
    public void confirmToken(String tokenValue) {

        Token token = tokenRepository.findByToken(tokenValue)
            .orElseThrow(() -> {
                log.warn("Confirmation échouée token={} : token invalide", tokenValue);
                return new ApiException(ErrorCode.TOKEN_INVALID);
            });

        if (token.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Confirmation échouée token={} : token expiré", tokenValue);
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }

        User user = token.getUser();
        user.setEnabled(true);

        tokenRepository.delete(token);

        log.info("Compte vérifié : {}", user.getEmail());
    }
}
