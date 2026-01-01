package com.example.meetmates.user.service;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.meetmates.auth.repository.TokenRepository;
import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.common.service.PictureService;
import com.example.meetmates.user.mapper.UserMapper;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.model.UserStatus;
import com.example.meetmates.user.repository.UserRepository;

class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private TokenRepository tokenRepository;
    @Mock private UserMapper userMapper;
    @Mock private PictureService pictureService;

    @InjectMocks private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");
        user.setPassword("password");
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE);
    }

    @Test
    void findActiveByEmailOrThrow_success() {
        when(userRepository.findByEmailAndDeletedAtIsNull("test@test.com")).thenReturn(Optional.of(user));
        User result = userService.findActiveByEmailOrThrow("test@test.com");
        assertNotNull(result);
        assertEquals(user.getEmail(), result.getEmail());
    }

    @Test
    void findActiveByEmailOrThrow_notFound() {
        when(userRepository.findByEmailAndDeletedAtIsNull("test@test.com")).thenReturn(Optional.empty());
        ApiException ex = assertThrows(ApiException.class, () ->
            userService.findActiveByEmailOrThrow("test@test.com")
        );
        assertEquals(ErrorCode.USER_NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void loadUserByUsername_success() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        UserDetails details = userService.loadUserByUsername("test@test.com");
        assertNotNull(details);
        assertEquals(user.getEmail(), details.getUsername());
    }

    @Test
    void loadUserByUsername_banned() {
        user.setStatus(UserStatus.BANNED);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        ApiException ex = assertThrows(ApiException.class, () ->
            userService.loadUserByUsername("test@test.com")
        );
        assertEquals(ErrorCode.USER_BANNED, ex.getErrorCode());
    }

    @Test
    void loadUserByUsername_disabled() {
        user.setEnabled(false);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        ApiException ex = assertThrows(ApiException.class, () ->
            userService.loadUserByUsername("test@test.com")
        );
        assertEquals(ErrorCode.USER_DISABLED, ex.getErrorCode());
    }

    @Test
    void loadUserByUsername_notFound() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());
        ApiException ex = assertThrows(ApiException.class, () ->
            userService.loadUserByUsername("test@test.com")
        );
        assertEquals(ErrorCode.USER_NOT_FOUND, ex.getErrorCode());
    }
}
