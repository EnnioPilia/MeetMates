package com.example.meetmates.mapper;

import org.springframework.stereotype.Component;

import com.example.meetmates.dto.UpdateUserDto;
import com.example.meetmates.dto.UserDto;
import com.example.meetmates.model.User;

/**
 * Mapper responsable de la conversion entre l'entité {@link User}
 * et les DTOs {@link UserDto} et {@link UpdateUserDto}.
 *
 * Il permet :
 * - la transformation d'un utilisateur vers un DTO lisible par l'API,
 * - la mise à jour de l'entité User à partir d'un DTO de mise à jour.
 */
@Component
public class UserMapper {

    /**
     * Convertit un {@link User} en {@link UserDto}.
     * Retourne null si l'entité fournie est null.
     *
     * @param user l'utilisateur à convertir
     * @return un DTO représentant l'utilisateur ou null
     */
    public UserDto toDto(User user) {
        if (user == null) return null;

        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getAge(),
                user.getCity(),
                user.getProfilePictureUrl(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getStatus() != null ? user.getStatus().name() : null,
                user.getDeletedAt() 
        );
    }

    /**
     * Met à jour l'entité {@link User} avec les valeurs non nulles du {@link UpdateUserDto}.
     * Cette méthode modifie l'objet existant afin de préserver les relations JPA.
     *
     * Règles appliquées :
     * - Si un champ du DTO vaut null, il n'est pas modifié.
     * - L'âge n'est mis à jour que s'il est supérieur ou égal à 13.
     *
     * @param dto les données de mise à jour
     * @param user l'entité utilisateur à modifier
     */
    public void updateFromDto(UpdateUserDto dto, User user) {
        if (dto == null || user == null) return;
        
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName()  != null) user.setLastName(dto.getLastName());
        if (dto.getAge()       != null && dto.getAge() >= 13) user.setAge(dto.getAge());
        if (dto.getCity()      != null) user.setCity(dto.getCity());
    }
}
