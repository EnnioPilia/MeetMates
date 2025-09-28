package com.example.meetmates.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.meetmates.model.core.User;
import com.example.meetmates.model.security.Token;
import com.example.meetmates.model.security.TokenType;
import com.example.meetmates.repository.TokenRepository;
import com.example.meetmates.repository.UserRepository;

@Service
public class PasswordResetService {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetService(TokenRepository tokenRepository,
                                UserRepository userRepository,
                                PasswordEncoder passwordEncoder,
                                EmailService emailService) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Étape 1 - Demande de reset
    public String createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Supprimer anciens tokens de reset
        tokenRepository.deleteByUser_IdAndType(user.getId(), TokenType.PASSWORD_RESET);

        String tokenString = UUID.randomUUID().toString();
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(30 * 60); // 30 minutes

        Token token = new Token(tokenString, user, now, expiresAt, TokenType.PASSWORD_RESET);
        Token saved = tokenRepository.save(token);

        // === DEBUG LOG ===
        System.out.println(">>> [RESET] Token sauvegardé : " + saved.getToken()
                + " | type=" + saved.getType()
                + " | user=" + saved.getUser().getEmail()
                + " | expire à " + saved.getExpiresAt());

        // Envoyer email avec le token brut (EmailService construit l’URL)
        emailService.sendPasswordResetEmail(user.getEmail(), tokenString);

        return "Un lien de réinitialisation a été envoyé à votre adresse email.";
    }

    // Étape 2 - Réinitialisation du mot de passe
    public String resetPassword(String tokenString, String newPassword) {
        Token token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new RuntimeException("Token invalide"));

        if (token.getType() != TokenType.PASSWORD_RESET) {
            throw new RuntimeException("Token invalide");
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token expiré");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Supprimer le token après utilisation
        tokenRepository.delete(token);

        System.out.println(">>> [RESET] Mot de passe réinitialisé pour : " + user.getEmail());

        return "Mot de passe réinitialisé avec succès.";
    }
}
