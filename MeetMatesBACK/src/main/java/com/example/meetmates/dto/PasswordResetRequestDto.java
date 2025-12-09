package com.example.meetmates.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO utilisé pour demander la réinitialisation d'un mot de passe.
 *
 * L'utilisateur fournit simplement son adresse email, qui sera utilisée
 * pour envoyer un lien ou un jeton de réinitialisation.
 */
public class PasswordResetRequestDto {

    /** Adresse email associée au compte à réinitialiser. */
    @Email(message = "Email invalide.")
    @NotBlank(message = "L'email est obligatoire.")
    private String email;

    /** Constructeur vide requis pour la désérialisation. */
    public PasswordResetRequestDto() {}


    // --- GETTER & SETTER ---
    
    /** Retourne l'adresse email renseignée.
     * @return email
     */
    public String getEmail() {
        return email;
    }

    /** Définit l'adresse email pour la demande de réinitialisation.
     * @param email adresse email valide
     */
    public void setEmail(String email) {
        this.email = email;
    }
}
