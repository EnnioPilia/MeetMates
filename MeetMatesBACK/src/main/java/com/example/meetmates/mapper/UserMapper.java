package com.example.meetmates.mapper;

import org.springframework.stereotype.Component;

import com.example.meetmates.dto.UserDto;
import com.example.meetmates.model.User;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getAge(),
                user.getCity(),
                user.getProfilePictureUrl()
        );
    }
}
