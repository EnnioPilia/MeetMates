package com.example.meetmates.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.meetmates.exception.ConflictException;
import com.example.meetmates.exception.ErrorCode;
import com.example.meetmates.exception.NotFoundException;
import com.example.meetmates.exception.UnauthorizedException;
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

    /**
     * Génère un token de vérification pour un utilisateur non vérifié.
     */
    public String createVerificationToken(User user) {

        if (user.isEnabled()) {
            throw new ConflictException(ErrorCode.USER_ALREADY_VERIFIED);
        }

        tokenRepository.deleteByUser_IdAndType(user.getId(), TokenType.VERIFICATION);

        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(24 * 3600),
                TokenType.VERIFICATION
        );

        tokenRepository.save(token);
        log.info("[VERIFY] Token créé pour {}", user.getEmail());

        return token.getToken();
    }

    /**
     * Valide le token de confirmation.
     */
    public void confirmToken(String tokenValue) {

        Token token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new NotFoundException(ErrorCode.TOKEN_INVALID));

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new UnauthorizedException(ErrorCode.TOKEN_EXPIRED);
        }

        User user = token.getUser();
        user.setEnabled(true);

        tokenRepository.delete(token);

        log.info("[VERIFY] Compte vérifié : {}", user.getEmail());
    }
}
