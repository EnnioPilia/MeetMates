package com.example.meetmates.dto;

/**
 * DTO utilisé pour la mise à jour des informations d'un utilisateur existant.
 *
 * Ce modèle transporte uniquement les champs modifiables par l'utilisateur
 * ou via son profil, sans exposer l'entité complète.
 */
public class UpdateUserDto {

    /** Nouveau prénom de l'utilisateur (optionnel). */
    private String firstName;

    /** Nouveau nom de famille de l'utilisateur (optionnel). */
    private String lastName;

    /** Nouvel âge de l'utilisateur (optionnel). */
    private Integer age;

    /** Nouvelle ville de résidence de l'utilisateur (optionnel). */
    private String city;

    /** URL de la nouvelle photo de profil de l'utilisateur. */
    private String profilePictureUrl;


    // --- GETTERS & SETTERS ---

    /** @return le prénom de l'utilisateur */
    public String getFirstName() { return firstName; }

    /** @param firstName nouveau prénom de l'utilisateur */
    public void setFirstName(String firstName) { this.firstName = firstName; }

    /** @return le nom de l'utilisateur */
    public String getLastName() { return lastName; }

    /** @param lastName nouveau nom de l'utilisateur */
    public void setLastName(String lastName) { this.lastName = lastName; }

    /** @return l'âge de l'utilisateur */
    public Integer getAge() { return age; }

    /** @param age nouvel âge de l'utilisateur */
    public void setAge(Integer age) { this.age = age; }

    /** @return la ville de l'utilisateur */
    public String getCity() { return city; }

    /** @param city nouvelle ville de résidence */
    public void setCity(String city) { this.city = city; }

    /** @return URL de la photo de profil */
    public String getProfilePictureUrl() { return profilePictureUrl; }

    /** @param profilePictureUrl nouvelle URL de photo de profil */
    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}
