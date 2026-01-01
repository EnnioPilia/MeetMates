package com.example.meetmates.user.mapper;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.meetmates.user.dto.UpdateUserDto;
import com.example.meetmates.user.dto.UserDto;
import com.example.meetmates.user.model.User;
import com.example.meetmates.user.model.UserRole;
import com.example.meetmates.user.model.UserStatus;

class UserMapperTest {

    private UserMapper userMapper;

    @BeforeEach
    void setUp() {
        userMapper = new UserMapper();
    }

    // =========================
    // toDto
    // =========================
    @Test
    void toDto_should_return_null_when_user_is_null() {
        // WHEN
        UserDto dto = userMapper.toDto(null);

        // THEN
        assertNull(dto);
    }

    @Test
    void toDto_should_map_all_fields_correctly() {
        // GIVEN
        User user = new User();
        UUID id = UUID.randomUUID();
        LocalDateTime deletedAt = LocalDateTime.now();

        user.setId(id);
        user.setFirstName("Alice");
        user.setLastName("Martin");
        user.setEmail("alice@test.com");
        user.setAge(25);
        user.setCity("Paris");
        user.setProfilePictureUrl("profile.jpg");
        user.setRole(UserRole.ADMIN);
        user.setStatus(UserStatus.ACTIVE);
        user.setDeletedAt(deletedAt);

        // WHEN
        UserDto dto = userMapper.toDto(user);

        // THEN
        assertNotNull(dto);
        assertEquals(id, dto.id());
        assertEquals("Alice", dto.firstName());
        assertEquals("Martin", dto.lastName());
        assertEquals("alice@test.com", dto.email());
        assertEquals(25, dto.age());
        assertEquals("Paris", dto.city());
        assertEquals("profile.jpg", dto.profilePictureUrl());
        assertEquals("ADMIN", dto.role());
        assertEquals("ACTIVE", dto.status());
        assertEquals(deletedAt, dto.deletedAt());
    }

    // =========================
    // updateFromDto
    // =========================
    @Test
    void updateFromDto_should_update_only_non_null_fields() {
        // GIVEN
        User user = new User();
        user.setFirstName("OldFirst");
        user.setLastName("OldLast");
        user.setAge(30);
        user.setCity("Lyon");

        UpdateUserDto dto = new UpdateUserDto();
        dto.setFirstName("NewFirst");
        dto.setCity("Paris");
        // lastName et age = null

        // WHEN
        userMapper.updateFromDto(dto, user);

        // THEN
        assertEquals("NewFirst", user.getFirstName());
        assertEquals("OldLast", user.getLastName()); // inchangé
        assertEquals(30, user.getAge());              // inchangé
        assertEquals("Paris", user.getCity());
    }

    @Test
    void updateFromDto_should_not_update_age_if_under_13() {
        // GIVEN
        User user = new User();
        user.setAge(20);

        UpdateUserDto dto = new UpdateUserDto();
        dto.setAge(10); // invalide

        // WHEN
        userMapper.updateFromDto(dto, user);

        // THEN
        assertEquals(20, user.getAge());
    }

    @Test
    void updateFromDto_should_update_age_if_13_or_more() {
        // GIVEN
        User user = new User();
        user.setAge(20);

        UpdateUserDto dto = new UpdateUserDto();
        dto.setAge(18);

        // WHEN
        userMapper.updateFromDto(dto, user);

        // THEN
        assertEquals(18, user.getAge());
    }

    @Test
    void updateFromDto_should_do_nothing_if_dto_or_user_is_null() {
        // GIVEN
        User user = new User();
        user.setFirstName("Alice");

        // WHEN
        userMapper.updateFromDto(null, user);
        userMapper.updateFromDto(new UpdateUserDto(), null);

        // THEN
        assertEquals("Alice", user.getFirstName());
    }
}
