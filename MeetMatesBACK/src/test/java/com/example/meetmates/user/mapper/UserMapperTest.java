package com.example.meetmates.user.mapper;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

import com.example.meetmates.user.dto.UpdateUserDto;
import com.example.meetmates.user.dto.UserDto;
import com.example.meetmates.user.model.User;

class UserMapperTest {

    private final UserMapper userMapper = new UserMapper();

    @Test
    void should_update_only_non_null_fields() {
        User user = new User();
        user.setFirstName("OldFirst");
        user.setLastName("OldLast");
        user.setAge(30);
        user.setCity("Lyon");

        UpdateUserDto dto = new UpdateUserDto();
        dto.setFirstName("NewFirst");
        dto.setCity("Paris");

        userMapper.updateFromDto(dto, user);

        assertEquals("NewFirst", user.getFirstName());
        assertEquals("OldLast", user.getLastName());
        assertEquals(30, user.getAge());
        assertEquals("Paris", user.getCity());
    }

    @Test
    void should_not_update_age_if_under_13() {
        User user = new User();
        user.setAge(20);

        UpdateUserDto dto = new UpdateUserDto();
        dto.setAge(10);

        userMapper.updateFromDto(dto, user);

        assertEquals(20, user.getAge());
    }

    @Test
    void should_update_age_if_13_or_more() {
        User user = new User();
        user.setAge(20);

        UpdateUserDto dto = new UpdateUserDto();
        dto.setAge(18);

        userMapper.updateFromDto(dto, user);

        assertEquals(18, user.getAge());
    }

@Test
void should_map_user_to_dto() {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setFirstName("John");
    user.setLastName("Doe");
    user.setEmail("john@doe.com");
    user.setAge(25);
    user.setCity("Paris");

    UserDto dto = userMapper.toDto(user);

    assertNotNull(dto);
    assertEquals("John", dto.firstName());
    assertEquals("Doe", dto.lastName());
    assertEquals("john@doe.com", dto.email());
    assertEquals(25, dto.age());
    assertEquals("Paris", dto.city());
}


    @Test
    void should_return_null_dto_when_user_is_null() {
        assertNull(userMapper.toDto(null));
    }

    @Test
    void should_do_nothing_when_dto_is_null() {
        User user = new User();
        user.setFirstName("John");

        userMapper.updateFromDto(null, user);

        assertEquals("John", user.getFirstName());
    }

    @Test
    void should_not_update_fields_not_present_in_dto() {
        User user = new User();
        user.setFirstName("John");
        user.setEmail("secure@email.com");

        UpdateUserDto dto = new UpdateUserDto();
        dto.setFirstName("Jane");

        userMapper.updateFromDto(dto, user);

        assertEquals("Jane", user.getFirstName());
        assertEquals("secure@email.com", user.getEmail());
    }

}
