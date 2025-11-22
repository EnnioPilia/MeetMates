package com.example.meetmates.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.exception.TokenExpiredException;
import com.example.meetmates.exception.TokenNotFoundException;
import com.example.meetmates.exception.UserAlreadyVerifiedException;
import com.example.meetmates.model.Token;
import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.TokenRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class VerificationService {

    private final TokenRepository tokenRepository;

    public VerificationService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // * Génère un token de vérification pour un utilisateur non vérifié
    public String createVerificationToken(User user) {
        if (user.isEnabled()) {
            throw new UserAlreadyVerifiedException("Votre compte est déjà vérifié.");
        }

        tokenRepository.deleteByUser_IdAndType(user.getId(), TokenType.VERIFICATION);

        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(24 * 3600), // * Expire après 24h 
                TokenType.VERIFICATION
        );

        tokenRepository.save(token);

        log.info("[VERIFY] Token de vérification créé pour user={}", user.getEmail());

        return token.getToken();
    }

    // * Active le compte utilisateur si le token est valide et non expiré
    public void confirmToken(String tokenString) {
        Token token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new TokenNotFoundException("Token invalide"));

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new TokenExpiredException("Le lien de vérification a expiré.");
        }

        User user = token.getUser();
        user.setEnabled(true);

        tokenRepository.delete(token);

        log.info("[VERIFY] User {} vérifié avec succès.", user.getEmail());
    }
}
