package com.example.meetmates.auth.dto;

/**
 * DTO représentant une demande de connexion utilisateur.
 * 
 * Utilisé pour transmettre les informations nécessaires
 * à l'authentification (email et mot de passe) via l'API.
 */
public class LoginRequestDto {

    private String email;
    private String password;

    /** Constructeur vide requis pour la désérialisation JSON. */
    public LoginRequestDto() {}

    /**
     * Construit un DTO de demande de connexion.
     * @param email adresse email de l'utilisateur
     * @param password mot de passe de l'utilisateur
     */
    public LoginRequestDto(String email, String password) {
        this.email = email;
        this.password = password;
    }


    // --- GETTERS & SETTERS ---
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
