package com.example.meetmates.admin.service;

import java.time.LocalDateTime;
import java.util.List;
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
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.meetmates.common.exception.ApiException;
import com.example.meetmates.common.exception.ErrorCode;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.model.UserStatus;
import com.example.meetmates.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminUserService adminUserService;

    /* ===================== GET USERS ===================== */

    @Test
    void getAllUsersIncludingDeleted_shouldReturnAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(new User(), new User()));

        List<User> result = adminUserService.getAllUsersIncludingDeleted();

        assertThat(result).hasSize(2);
        verify(userRepository).findAll();
    }

    @Test
    void getAllActiveUsers_shouldReturnOnlyNotDeletedUsers() {
        User active = new User();
        active.setDeletedAt(null);

        User deleted = new User();
        deleted.setDeletedAt(LocalDateTime.now());

        when(userRepository.findAll()).thenReturn(List.of(active, deleted));

        List<User> result = adminUserService.getAllActiveUsers();

        assertThat(result).containsExactly(active);
    }

    @Test
    void getAllUsers_shouldReturnOnlyActiveUsers() {
        User active = new User();
        active.setDeletedAt(null);

        User deleted = new User();
        deleted.setDeletedAt(LocalDateTime.now());

        when(userRepository.findAll()).thenReturn(List.of(active, deleted));

        List<User> result = adminUserService.getAllUsers();

        assertThat(result).containsExactly(active);
    }

    /* ===================== SOFT DELETE ===================== */

    @Test
    void softDeleteUser_shouldBanUser() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        adminUserService.softDeleteUser(userId);

        assertThat(user.getDeletedAt()).isNotNull();
        assertThat(user.isEnabled()).isFalse();
        assertThat(user.getStatus()).isEqualTo(UserStatus.BANNED);
    }

    @Test
    void softDeleteUser_shouldDoNothing_ifAlreadyDeleted() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setDeletedAt(LocalDateTime.now());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        adminUserService.softDeleteUser(userId);

        verify(userRepository, never()).delete(any());
    }

    /* ===================== RESTORE ===================== */

    @Test
    void restoreUser_shouldActivateUser() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setDeletedAt(LocalDateTime.now());
        user.setEnabled(false);
        user.setStatus(UserStatus.BANNED);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        adminUserService.restoreUser(userId);

        assertThat(user.getDeletedAt()).isNull();
        assertThat(user.isEnabled()).isTrue();
        assertThat(user.getStatus()).isEqualTo(UserStatus.ACTIVE);
    }

    /* ===================== HARD DELETE ===================== */

    @Test
    void hardDeleteUser_shouldDeleteUser() {
        UUID userId = UUID.randomUUID();
        User user = new User();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        adminUserService.hardDeleteUser(userId);

        verify(userRepository).delete(user);
    }

    /* ===================== NOT FOUND ===================== */

    @Test
    void softDeleteUser_shouldThrowException_whenUserNotFound() {
        UUID userId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> adminUserService.softDeleteUser(userId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining(ErrorCode.USER_NOT_FOUND.name());
    }
}
