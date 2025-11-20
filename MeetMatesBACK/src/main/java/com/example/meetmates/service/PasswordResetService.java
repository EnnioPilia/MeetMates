package com.example.meetmates.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.meetmates.exception.TokenExpiredException;
import com.example.meetmates.exception.TokenNotFoundException;
import com.example.meetmates.exception.UserNotFoundException;
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

    public PasswordResetService(TokenRepository tokenRepository,
                                UserRepository userRepository,
                                PasswordEncoder passwordEncoder,
                                EmailService emailService) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // * Génère un token et envoie l’email
    public String createPasswordResetToken(String email) {

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UserNotFoundException("❌ Aucun utilisateur trouvé avec cet email."));

        tokenRepository.deleteByUser_IdAndType(user.getId(), TokenType.PASSWORD_RESET);

        String tokenString = UUID.randomUUID().toString();
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(EXPIRATION_MINUTES * 60);

        Token token = new Token(tokenString, user, now, expiresAt, TokenType.PASSWORD_RESET);
        tokenRepository.save(token);

        log.info("[RESET] Token généré pour {} (expire dans {} min)", user.getEmail(), EXPIRATION_MINUTES);

        emailService.sendPasswordResetEmail(user.getEmail(), tokenString);

        return "Un email de réinitialisation a été envoyé.";
    }

    // * Vérifie le token et réinitialise le mot de passe
    public String resetPassword(String tokenString, String newPassword) {

        Token token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new TokenNotFoundException("❌ Token invalide."));

        if (token.getType() != TokenType.PASSWORD_RESET) {
            throw new TokenNotFoundException("❌ Ce token n'est pas un token de réinitialisation.");
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new TokenExpiredException("❌ Le lien de réinitialisation a expiré.");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(token);

        log.info("[RESET] Mot de passe réinitialisé pour {}", user.getEmail());

        return "Mot de passe réinitialisé avec succès.";
    }
}
