package com.example.meetmates.user.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import com.example.meetmates.user.dto.UpdateUserDto;
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
}
