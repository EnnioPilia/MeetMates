package com.example.meetmates.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.meetmates.exception.ApiException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.model.Token;
import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.TokenRepository;
import com.example.meetmates.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

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

    
    // * Génère un token de réinitialisation (PASSWORD_RESET) et envoie l'email.
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

        log.info("[RESET] Token généré pour {} (expire dans {} min)", user.getEmail(), EXPIRATION_MINUTES);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), tokenString);
        } catch (Exception e) {
            log.error("[RESET] Erreur envoi email pour {}", user.getEmail(), e);
            throw new ApiException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }


    // * Réinitialise le mot de passe après validation du token.
    @Transactional
    public void resetPassword(String tokenString, String newPassword) {

        Token token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new ApiException(ErrorCode.TOKEN_NOT_FOUND));

        if (token.getType() != TokenType.PASSWORD_RESET) {
            throw new ApiException(ErrorCode.TOKEN_INVALID);
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(token);

        log.info("[RESET] Mot de passe réinitialisé pour {}", user.getEmail());
    }
}
