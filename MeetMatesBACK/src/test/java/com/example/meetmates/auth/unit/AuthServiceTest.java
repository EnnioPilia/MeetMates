package com.example.meetmates.auth.unit;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.meetmates.auth.dto.LoginRequestDto;
import com.example.meetmates.auth.dto.LoginResponseDto;
import com.example.meetmates.auth.dto.RegisterRequestDto;
import com.example.meetmates.auth.model.Token;
import com.example.meetmates.auth.service.AuthService;
import com.example.meetmates.auth.service.RefreshTokenService;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.common.service.CookieService;
import com.example.meetmates.common.service.EmailService;
import com.example.meetmates.common.service.MessageService;
import com.example.meetmates.common.service.VerificationService;
import com.example.meetmates.security.JWTUtils;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.model.UserRole;
import com.example.meetmates.user.model.UserStatus;
import com.example.meetmates.user.repository.UserRepository;

import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JWTUtils jwtUtils;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private EmailService emailService;
    @Mock
    private VerificationService verificationService;
    @Mock
    private RefreshTokenService refreshTokenService;
    @Mock
    private CookieService cookieService;
    @Mock
    private HttpServletResponse response;
    @Mock
    private MessageService messageService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequestDto registerRequest;

    @BeforeEach
    void setup() {
        registerRequest = new RegisterRequestDto();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("john@mail.com");
        registerRequest.setPassword("Password1!");
        registerRequest.setAge(25);
        registerRequest.setDateAcceptationCGU(LocalDateTime.now());
    }

    @Test
    void should_register_new_user() {
        when(userRepository.findByEmail("john@mail.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Password1!")).thenReturn("encodedPass");

        doReturn("token123").when(verificationService).createVerificationToken(any());

        String result = authService.register(registerRequest);

        assertThat(result).isEqualTo("AUTH_REGISTER_SUCCESS");
        verify(userRepository).save(any(User.class));
        verify(emailService).sendVerificationEmail("john@mail.com", "token123");
    }

@Test
void should_login_user_successfully() {

    User user = new User();
    user.setEmail("john@mail.com");
    user.setEnabled(true);
    user.setStatus(UserStatus.ACTIVE);
    user.setRole(UserRole.USER);

    LoginRequestDto loginRequest =
            new LoginRequestDto("john@mail.com", "Password1!");

    Token refreshToken = new Token();
    refreshToken.setToken("refresh123");

    when(userRepository.findByEmail("john@mail.com"))
            .thenReturn(Optional.of(user));

    Authentication authMock = mock(Authentication.class);
    when(authenticationManager.authenticate(any()))
            .thenReturn(authMock);

    when(jwtUtils.generateAccessToken(any(), any()))
            .thenReturn("jwt123");

    when(jwtUtils.getJwtExpirationMs())
            .thenReturn(3600000);

    when(refreshTokenService.createRefreshToken(user))
            .thenReturn(refreshToken);

    LoginResponseDto result =
            authService.login(loginRequest, response);

    assertThat(result.getMessage())
            .isEqualTo("AUTH_LOGIN_SUCCESS");

    verify(cookieService).setAuthCookies(
            eq(response),
            eq("jwt123"),
            eq("refresh123"),
            anyLong(),
            anyLong()
    );
}


    @Test
    void should_throw_when_login_user_banned() {
        User user = new User();
        user.setEmail("john@mail.com");
        user.setEnabled(true);
        user.setStatus(UserStatus.BANNED);

        LoginRequestDto loginRequest = new LoginRequestDto("john@mail.com", "Password1!");

        when(userRepository.findByEmail("john@mail.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(loginRequest, response))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_BANNED);
    }

    @Test
    void should_verify_user() {
        doNothing().when(verificationService).confirmToken("token123");
        String result = authService.verifyUser("token123");
        assertThat(result).isEqualTo("AUTH_VERIFY_SUCCESS");
        verify(verificationService).confirmToken("token123");
    }

    @Test
    void should_logout_user() {
        doNothing().when(cookieService).clearAuthCookies(response);
        String result = authService.logout(response);
        assertThat(result).isEqualTo("AUTH_LOGOUT_SUCCESS");
        verify(cookieService).clearAuthCookies(response);
    }

    @Test
    void should_throw_when_email_already_used() {
        User existing = new User();
        existing.setDeletedAt(null);

        when(userRepository.findByEmail("john@mail.com"))
                .thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_EMAIL_USED);
    }

    @Test
    void should_throw_when_registering_banned_user() {
        User banned = new User();
        banned.setStatus(UserStatus.BANNED);

        when(userRepository.findByEmail("john@mail.com"))
                .thenReturn(Optional.of(banned));

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_BANNED);
    }

    @Test
    void should_throw_when_login_user_not_found() {
        LoginRequestDto loginRequest
                = new LoginRequestDto("john@mail.com", "Password1!");

        when(userRepository.findByEmail("john@mail.com"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(loginRequest, response))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_NOT_FOUND);
    }

    @Test
    void should_throw_when_login_user_disabled() {
        User user = new User();
        user.setEnabled(false);
        user.setStatus(UserStatus.ACTIVE);

        when(userRepository.findByEmail("john@mail.com"))
                .thenReturn(Optional.of(user));

        LoginRequestDto loginRequest
                = new LoginRequestDto("john@mail.com", "Password1!");

        assertThatThrownBy(() -> authService.login(loginRequest, response))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_DISABLED);
    }

    @Test
    void should_throw_when_login_user_deleted() {
        User user = new User();
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE);
        user.setDeletedAt(LocalDateTime.now());

        when(userRepository.findByEmail("john@mail.com"))
                .thenReturn(Optional.of(user));

        LoginRequestDto loginRequest
                = new LoginRequestDto("john@mail.com", "Password1!");

        assertThatThrownBy(() -> authService.login(loginRequest, response))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_DELETED);
    }

    @Test
    void should_throw_when_bad_password() {
        User user = new User();
        user.setEmail("john@mail.com");
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE);
        user.setRole(UserRole.USER);

        when(userRepository.findByEmail("john@mail.com"))
                .thenReturn(Optional.of(user));

        when(authenticationManager.authenticate(any()))
                .thenThrow(new org.springframework.security.authentication.BadCredentialsException("bad"));

        LoginRequestDto loginRequest
                = new LoginRequestDto("john@mail.com", "wrong");

        assertThatThrownBy(() -> authService.login(loginRequest, response))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AUTH_BAD_PASSWORD);
    }

}
