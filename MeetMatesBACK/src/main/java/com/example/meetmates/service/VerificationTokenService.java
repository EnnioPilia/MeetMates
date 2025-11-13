package com.example.meetmates.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.model.Token;
import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.TokenRepository;

@Service
public class VerificationTokenService {

    private final TokenRepository tokenRepository;

    public VerificationTokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

public String createVerificationToken(User user) {
    String tokenString = UUID.randomUUID().toString();

    Token token = new Token(
        tokenString,
        user,
        Instant.now(),
        Instant.now().plusSeconds(24 * 60 * 60), // expire dans 24h
        TokenType.VERIFICATION
    );

    tokenRepository.save(token);

    return tokenString;
}

    public boolean confirmToken(String tokenString) {
        Optional<Token> optionalToken = tokenRepository.findByToken(tokenString);
        if (optionalToken.isEmpty()) {
            return false; 
        }

        Token token = optionalToken.get();
        if (token.getType() != com.example.meetmates.model.TokenType.VERIFICATION) {
            return false; 
        }

        if (token.getExpiresAt() != null && token.getExpiresAt().isBefore(java.time.Instant.now())) {
            return false; 
        }

        User user = token.getUser();
        user.setEnabled(true);
        tokenRepository.delete(token);
        return true;
    }
}
