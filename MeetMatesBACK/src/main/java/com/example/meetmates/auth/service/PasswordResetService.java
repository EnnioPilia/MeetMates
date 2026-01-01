package com.example.meetmates.auth.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.model.TokenType;
import com.example.meetmates.auth.repository.TokenRepository;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.common.service.EmailService;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service pour la gestion de la réinitialisation des mots de passe.
 * Permet de générer un token de réinitialisation et de changer le mot de passe après validation du token.
 */
@Slf4j
@Service
public class PasswordResetService {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final long EXPIRATION_MINUTES = 30;

    public PasswordResetService(
            TokenRepository tokenRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    /**
     * Génère un token de réinitialisation de mot de passe (PASSWORD_RESET) pour l'utilisateur
     * identifié par son email et envoie un email contenant ce token.
     * Si l'utilisateur n'existe pas, lance une ApiException USER_NOT_FOUND.
     *
     * @param email adresse email de l'utilisateur
     * @throws ApiException si l'utilisateur n'existe pas ou si l'envoi de l'email échoue
     */
    @Transactional
    public void createPasswordResetToken(String email) {

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        tokenRepository.deleteByUser_IdAndType(user.getId(), TokenType.PASSWORD_RESET);

        String tokenString = UUID.randomUUID().toString();
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(EXPIRATION_MINUTES * 60);

        Token token = new Token(tokenString, user, now, expiresAt, TokenType.PASSWORD_RESET);
        tokenRepository.save(token);

        log.info("Token généré pour {} (expire dans {} min)", user.getEmail(), EXPIRATION_MINUTES);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), tokenString);
        } catch (Exception e) {
            log.error("Erreur envoi email pour {}", user.getEmail(), e);
            throw new ApiException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    /**
     * Réinitialise le mot de passe de l'utilisateur après validation du token.
     * Vérifie que le token existe, qu'il est du type PASSWORD_RESET et qu'il n'est pas expiré.
     * Supprime ensuite le token pour éviter toute réutilisation.
     *
     * @param tokenString le token de réinitialisation
     * @param newPassword le nouveau mot de passe à enregistrer
     * @throws ApiException si le token est invalide, expiré ou introuvable
     */
    @Transactional
    public void resetPassword(String tokenString, String newPassword) {

        Token token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new ApiException(ErrorCode.TOKEN_NOT_FOUND));

        if (token.getType() != TokenType.PASSWORD_RESET) {
            log.warn("Token invalide utilisé pour {}", token.getUser().getEmail());
            throw new ApiException(ErrorCode.TOKEN_INVALID);
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Token invalide utilisé pour {}", token.getUser().getEmail());
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(token);

        log.info("Mot de passe réinitialisé pour {}", user.getEmail());
    }
}
