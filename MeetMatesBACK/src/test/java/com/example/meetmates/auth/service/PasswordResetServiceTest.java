package com.example.meetmates.auth.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.model.TokenType;
import com.example.meetmates.auth.repository.TokenRepository;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.common.service.EmailService;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.repository.UserRepository;

class PasswordResetServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PasswordResetService passwordResetService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@mail.com");
    }


    @Test
    void should_create_password_reset_token_successfully() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
        doNothing().when(emailService).sendPasswordResetEmail(anyString(), anyString());

        passwordResetService.createPasswordResetToken("test@mail.com");

        verify(tokenRepository).deleteByUser_IdAndType(user.getId(), TokenType.PASSWORD_RESET);

        verify(tokenRepository).save(any(Token.class));

        verify(emailService).sendPasswordResetEmail(eq("test@mail.com"), anyString());
    }

    @Test
    void should_throw_exception_if_user_not_found() {
        when(userRepository.findByEmail("notfound@mail.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> passwordResetService.createPasswordResetToken("notfound@mail.com"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_NOT_FOUND);
    }

    @Test
    void should_throw_exception_if_email_sending_fails() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
        doThrow(new RuntimeException("SMTP error")).when(emailService)
                .sendPasswordResetEmail(anyString(), anyString());

        assertThatThrownBy(() -> passwordResetService.createPasswordResetToken("test@mail.com"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.EMAIL_SEND_FAILED);
    }


    @Test
    void should_reset_password_successfully() {
        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(3600),
                TokenType.PASSWORD_RESET
        );

        when(tokenRepository.findByToken(token.getToken())).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("newPass")).thenReturn("encodedPass");

        passwordResetService.resetPassword(token.getToken(), "newPass");

        assertThat(user.getPassword()).isEqualTo("encodedPass");
        verify(userRepository).save(user);
        verify(tokenRepository).delete(token);
    }

    @Test
    void should_throw_exception_if_token_not_found() {
        when(tokenRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> passwordResetService.resetPassword("invalid-token", "newPass"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_NOT_FOUND);
    }

    @Test
    void should_throw_exception_if_token_expired() {
        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now().minusSeconds(3600),
                Instant.now().minusSeconds(1),
                TokenType.PASSWORD_RESET
        );

        when(tokenRepository.findByToken(token.getToken())).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> passwordResetService.resetPassword(token.getToken(), "newPass"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_EXPIRED);
    }

    @Test
    void should_throw_exception_if_token_wrong_type() {
        Token token = new Token(
                UUID.randomUUID().toString(),
                user,
                Instant.now(),
                Instant.now().plusSeconds(3600),
                TokenType.VERIFICATION
        );

        when(tokenRepository.findByToken(token.getToken())).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> passwordResetService.resetPassword(token.getToken(), "newPass"))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.TOKEN_INVALID);
    }



@Test
void should_allow_reset_password_exactly_at_expiration_time() {
    Instant now = Instant.now();
    Token token = new Token(
            UUID.randomUUID().toString(),
            user,
            now.minusSeconds(3600),
            now, 
            TokenType.PASSWORD_RESET
    );
    when(tokenRepository.findByToken(token.getToken())).thenReturn(Optional.of(token));
    when(passwordEncoder.encode("newPass")).thenReturn("encodedPass");

    passwordResetService.resetPassword(token.getToken(), "newPass"); 

    assertThat(user.getPassword()).isEqualTo("encodedPass");
    verify(userRepository).save(user);
    verify(tokenRepository).delete(token);
}

}
