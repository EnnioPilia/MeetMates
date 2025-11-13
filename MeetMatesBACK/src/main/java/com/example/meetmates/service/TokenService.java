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
public class TokenService {

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public Token createToken(User user, TokenType type, long durationInSeconds) {
        Token token = new Token();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setCreatedAt(Instant.now());
        token.setExpiresAt(Instant.now().plusSeconds(durationInSeconds));
        token.setType(type);
        token.setUsed(false);
        return tokenRepository.save(token);
    }

    public Optional<Token> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public void deleteTokenByUserAndType(UUID userId, TokenType type) {
        tokenRepository.deleteByUser_IdAndType(userId, type);
    }

    public void markTokenAsUsed(Token token) {
        token.setUsed(true);
        token.setConfirmedAt(Instant.now());
        tokenRepository.save(token);
    }
}
