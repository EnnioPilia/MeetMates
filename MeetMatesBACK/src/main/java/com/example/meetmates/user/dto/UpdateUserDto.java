package com.example.meetmates.user.dto;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO utilisé pour la mise à jour des informations d'un utilisateur existant.
 *
 * Ce modèle transporte uniquement les champs modifiables par l'utilisateur
 * ou via son profil, sans exposer l'entité complète.
 */
public class UpdateUserDto {

    @NotBlank
    private String firstName;
    private String lastName;
    private Integer age;
    private String city;
    private String profilePictureUrl;


    // --- GETTERS & SETTERS ---
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}
