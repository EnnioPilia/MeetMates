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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.model.TokenType;
import com.example.meetmates.auth.repository.TokenRepository;
import com.example.meetmates.auth.service.TokenService;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.user.model.User;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private TokenService tokenService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@mail.com");
    }

    @Test
    void should_create_token_and_delete_previous_tokens() {
        when(tokenRepository.save(any(Token.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Token token = tokenService.createToken(user, TokenType.VERIFICATION, 3600);

        assertThat(token.getUser()).isEqualTo(user);
        assertThat(token.getType()).isEqualTo(TokenType.VERIFICATION);
        assertThat(token.isUsed()).isFalse();
        assertThat(token.getExpiresAt()).isAfter(Instant.now());

        verify(tokenRepository).deleteByUser_IdAndType(user.getId(), TokenType.VERIFICATION);
        verify(tokenRepository).save(any(Token.class));
    }

    @Test
    void should_throw_exception_when_token_not_found() {
        when(tokenRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tokenService.getValidToken("invalid-token"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_NOT_FOUND);
    }

    @Test
    void should_throw_exception_when_token_used() {
        Token token = new Token("token1", user, Instant.now(), Instant.now().plusSeconds(3600), TokenType.VERIFICATION);
        token.setUsed(true);
        when(tokenRepository.findByToken("token1")).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> tokenService.getValidToken("token1"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_INVALID);
    }

    @Test
    void should_throw_exception_when_token_expired() {
        Token token = new Token("token2", user, Instant.now().minusSeconds(3600), Instant.now().minusSeconds(10), TokenType.VERIFICATION);
        when(tokenRepository.findByToken("token2")).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> tokenService.getValidToken("token2"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_EXPIRED);
    }

    @Test
    void should_mark_token_as_used() {
        Token token = new Token("token3", user, Instant.now(), Instant.now().plusSeconds(3600), TokenType.VERIFICATION);
        when(tokenRepository.save(any(Token.class))).thenReturn(token);

        tokenService.markTokenAsUsed(token);

        assertThat(token.isUsed()).isTrue();
        assertThat(token.getConfirmedAt()).isNotNull();
        verify(tokenRepository).save(token);
    }

    @Test
    void should_delete_tokens_by_user_and_type() {
        tokenService.deleteTokenByUserAndType(user.getId(), TokenType.REFRESH);

        verify(tokenRepository).deleteByUser_IdAndType(user.getId(), TokenType.REFRESH);
    }
}
