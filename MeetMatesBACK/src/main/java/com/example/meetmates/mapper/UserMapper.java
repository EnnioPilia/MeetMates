package com.example.meetmates.mapper;

import org.springframework.stereotype.Component;

import com.example.meetmates.dto.UpdateUserDto;
import com.example.meetmates.dto.UserDto;
import com.example.meetmates.model.User;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) return null;

        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getAge(),
                user.getCity(), // si ta structure utilise directement city sur User
                user.getProfilePictureUrl()
        );
    }

    /**
     * Applique en place les valeurs non-nulles du DTO sur l'entité.
     * On ne crée pas une nouvelle instance pour garder les relations JPA intactes.
     */
    public void updateFromDto(UpdateUserDto dto, User user) {
        if (dto == null || user == null) return;

        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName()  != null) user.setLastName(dto.getLastName());
        if (dto.getAge()       != null && dto.getAge() >= 13) user.setAge(dto.getAge());
        if (dto.getCity()      != null) user.setCity(dto.getCity());
        if (dto.getProfilePictureUrl() != null) user.setProfilePictureUrl(dto.getProfilePictureUrl());
    }
}
