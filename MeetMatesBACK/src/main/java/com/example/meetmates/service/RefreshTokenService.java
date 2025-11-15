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
public class RefreshTokenService {

    private final TokenRepository tokenRepository;

    public RefreshTokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public Token createRefreshToken(User user) {
        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(7 * 24 * 3600),
                TokenType.REFRESH
        );
        token.setUsed(false);
        return tokenRepository.save(token);
    }

    public Optional<Token> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public boolean isExpired(Token token) {
        return token.getExpiresAt().isBefore(Instant.now());
    }

    public Token rotateToken(Token oldToken) {
        oldToken.setUsed(true);
        tokenRepository.save(oldToken);

        return createRefreshToken(oldToken.getUser());
    }
}
