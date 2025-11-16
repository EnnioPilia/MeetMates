package com.example.meetmates.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.exception.TokenAlreadyUsedException;
import com.example.meetmates.exception.TokenExpiredException;
import com.example.meetmates.exception.TokenNotFoundException;
import com.example.meetmates.model.Token;
import com.example.meetmates.model.TokenType;
import com.example.meetmates.model.User;
import com.example.meetmates.repository.TokenRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TokenService {

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // * Génère et persiste un token générique pour un utilisateur
    public Token createToken(User user, TokenType type, long durationSeconds) {
        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(durationSeconds),
                type
        );

        token.setUsed(false);
        Token saved = tokenRepository.save(token);

        log.info("[TOKEN] Nouveau token {} créé pour user={} type={}", 
                saved.getToken(), user.getEmail(), type);

        return saved;
    }

    // * Récupère un token et vérifie: qu'il existe/qu'il n'a pas déjà été utilisé/qu'il n'est pas expiré
    //   Et renvoie le token valide ou lève une exception adaptée
    public Token getValidToken(String tokenString) {
        Token token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new TokenNotFoundException("Token introuvable"));

        if (token.isUsed()) {
            throw new TokenAlreadyUsedException("Ce token a déjà été utilisé.");
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new TokenExpiredException("Le token a expiré.");
        }

        return token;
    }

    // * Marque un token comme utilisé pour empêcher toute réutilisation
    public void markTokenAsUsed(Token token) {
        token.setUsed(true);
        token.setConfirmedAt(Instant.now());
        tokenRepository.save(token);

        log.info("[TOKEN] Token {} marqué comme utilisé.", token.getToken());
    }

    // * Supprime tous les tokens d’un utilisateur pour un type donné
    public void deleteTokenByUserAndType(UUID userId, TokenType type) {
        tokenRepository.deleteByUser_IdAndType(userId, type);
        log.info("[TOKEN] Tokens de type {} supprimés pour user={}", type, userId);
    }
}
