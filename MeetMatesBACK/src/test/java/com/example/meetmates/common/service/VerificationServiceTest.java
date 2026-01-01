package com.example.meetmates.common.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.model.TokenType;
import com.example.meetmates.auth.repository.TokenRepository;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.user.model.User;

@ExtendWith(MockitoExtension.class)
class VerificationServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private VerificationService verificationService;

    @Test
    void should_create_verification_token_for_non_verified_user() {
        // GIVEN
        User user = new User();
        UUID userId = UUID.randomUUID();
        user.setId(userId);
        user.setEnabled(false);
        user.setEmail("test@mail.com");

        // WHEN
        String token = verificationService.createVerificationToken(user);

        // THEN
        assertThat(token).isNotBlank();

        verify(tokenRepository)
                .deleteByUser_IdAndType(userId, TokenType.VERIFICATION);
        verify(tokenRepository)
                .save(any(Token.class));
    }

    @Test
    void should_throw_exception_when_user_already_verified() {
        // GIVEN
        User user = new User();
        user.setEnabled(true);
        user.setEmail("verified@mail.com");

        // WHEN / THEN
        assertThatThrownBy(() -> verificationService.createVerificationToken(user))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_ALREADY_VERIFIED);

        verifyNoInteractions(tokenRepository);
    }

    @Test
    void should_throw_exception_when_token_not_found() {
        // GIVEN
        when(tokenRepository.findByToken("invalid-token"))
                .thenReturn(Optional.empty());

        // WHEN / THEN
        assertThatThrownBy(() -> verificationService.confirmToken("invalid-token"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_INVALID);
    }

    @Test
    void should_throw_exception_when_token_expired() {
        // GIVEN
        User user = new User();
        user.setEnabled(false);

        Token token = new Token(
                "expired-token",
                user,
                Instant.now().minusSeconds(3600),
                Instant.now().minusSeconds(10),
                TokenType.VERIFICATION
        );

        when(tokenRepository.findByToken("expired-token"))
                .thenReturn(Optional.of(token));

        // WHEN / THEN
        assertThatThrownBy(() -> verificationService.confirmToken("expired-token"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_EXPIRED);

        verify(tokenRepository, never()).delete(any());
    }

    @Test
    void should_confirm_token_and_enable_user() {
        // GIVEN
        User user = new User();
        user.setEnabled(false);
        user.setEmail("confirm@mail.com");

        Token token = new Token(
                "valid-token",
                user,
                Instant.now().minusSeconds(10),
                Instant.now().plusSeconds(3600),
                TokenType.VERIFICATION
        );

        when(tokenRepository.findByToken("valid-token"))
                .thenReturn(Optional.of(token));

        // WHEN
        verificationService.confirmToken("valid-token");

        // THEN
        assertThat(user.isEnabled()).isTrue();
        verify(tokenRepository).delete(token);
    }
}
