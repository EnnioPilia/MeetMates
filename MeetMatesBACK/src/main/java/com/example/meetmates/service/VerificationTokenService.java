package com.example.meetmates.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
    
import com.example.meetmates.model.core.User;
import com.example.meetmates.model.security.Token;
import com.example.meetmates.model.security.TokenType;
import com.example.meetmates.repository.TokenRepository;

@Service
public class VerificationTokenService {

    private final TokenRepository tokenRepository;

    public VerificationTokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

public String createVerificationToken(User user) {
    // Génération d'un token unique
    String tokenString = UUID.randomUUID().toString();

    // Création du token
    Token token = new Token(
        tokenString,
        user,
        Instant.now(),
        Instant.now().plusSeconds(24 * 60 * 60), // expire dans 24h
        TokenType.VERIFICATION
    );

    // Sauvegarde dans la base
    tokenRepository.save(token);

    // Retourner uniquement la valeur du token
    return tokenString;
}

    // Confirme un token de vérification
    public boolean confirmToken(String tokenString) {
        Optional<Token> optionalToken = tokenRepository.findByToken(tokenString);
        if (optionalToken.isEmpty()) {
            return false; // token inexistant
        }

        Token token = optionalToken.get();
        if (token.getType() != com.example.meetmates.model.security.TokenType.VERIFICATION) {
            return false; // mauvais type
        }

        if (token.getExpiresAt() != null && token.getExpiresAt().isBefore(java.time.Instant.now())) {
            return false; // token expiré
        }

        // Activer l'utilisateur
        User user = token.getUser();
        user.setEnabled(true);
        tokenRepository.delete(token); // supprimer le token après confirmation
        return true;
    }
}
