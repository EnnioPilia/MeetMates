package com.example.meetmates.dto;

/**
 * DTO représentant une demande de connexion utilisateur.
 * 
 * Utilisé pour transmettre les informations nécessaires
 * à l'authentification (email et mot de passe) via l'API.
 */
public class LoginRequestDto {

    /** Adresse email de l'utilisateur. */
    private String email;

    /** Mot de passe de l'utilisateur. */
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

    /** Retourne l'adresse email de l'utilisateur.
     * @return email
     */
    public String getEmail() { return email; }

    /** Définit l'adresse email de l'utilisateur.
     * @param email email de connexion
     */
    public void setEmail(String email) { this.email = email; }

    /** Retourne le mot de passe.
     * @return mot de passe
     */
    public String getPassword() { return password; }

    /** Définit le mot de passe.
     * @param password mot de passe de connexion
     */
    public void setPassword(String password) { this.password = password; }
}
