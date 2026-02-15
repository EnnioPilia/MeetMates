package com.example.meetmates.auth.unit;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.model.TokenType;
import com.example.meetmates.auth.repository.TokenRepository;
import com.example.meetmates.auth.service.RefreshTokenService;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.user.model.User;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID()); 
        user.setEmail("test@mail.com");
    }

    @Test
    void should_create_refresh_token() {
        when(tokenRepository.save(any(Token.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Token token = refreshTokenService.createRefreshToken(user);

        assertThat(token).isNotNull();
        assertThat(token.getUser()).isEqualTo(user);
        assertThat(token.getType()).isEqualTo(TokenType.REFRESH);
        assertThat(token.isUsed()).isFalse();

        verify(tokenRepository).deleteByUser_IdAndType(user.getId(), TokenType.REFRESH);
        verify(tokenRepository).save(any(Token.class));
    }

    @Test
    void should_return_valid_refresh_token() {
        Token token = new Token("token-123", user, Instant.now(), Instant.now().plusSeconds(3600), TokenType.REFRESH);
        when(tokenRepository.findByTokenWithUser("token-123")).thenReturn(Optional.of(token));

        Token result = refreshTokenService.getValidRefreshToken("token-123");

        assertThat(result).isEqualTo(token);
    }

    @Test
    void should_throw_exception_if_token_not_found() {
        when(tokenRepository.findByTokenWithUser("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> refreshTokenService.getValidRefreshToken("missing"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_NOT_FOUND);
    }

    @Test
    void should_throw_exception_if_token_already_used() {
        Token token = new Token("used-token", user, Instant.now(), Instant.now().plusSeconds(3600), TokenType.REFRESH);
        token.setUsed(true);
        when(tokenRepository.findByTokenWithUser("used-token")).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> refreshTokenService.getValidRefreshToken("used-token"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_INVALID);
    }

    @Test
    void should_throw_exception_if_token_expired() {
        Token token = new Token("expired-token", user, Instant.now().minusSeconds(3600), Instant.now().minusSeconds(10), TokenType.REFRESH);
        when(tokenRepository.findByTokenWithUser("expired-token")).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> refreshTokenService.getValidRefreshToken("expired-token"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_EXPIRED);
    }

    @Test
    void should_rotate_refresh_token() {
        Token oldToken = new Token("old-token", user, Instant.now(), Instant.now().plusSeconds(3600), TokenType.REFRESH);
        when(tokenRepository.save(any(Token.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Token newToken = refreshTokenService.rotateRefreshToken(oldToken);

        assertThat(oldToken.isUsed()).isTrue();
        assertThat(oldToken.getConfirmedAt()).isNotNull();

        assertThat(newToken).isNotNull();
        assertThat(newToken.getUser()).isEqualTo(user);
        assertThat(newToken.getType()).isEqualTo(TokenType.REFRESH);
        assertThat(newToken.isUsed()).isFalse();

        verify(tokenRepository, times(2)).save(any(Token.class));
    }
}
