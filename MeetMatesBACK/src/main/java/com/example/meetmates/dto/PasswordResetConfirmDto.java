package com.example.meetmates.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
/**
 * DTO utilisé lors de la confirmation de réinitialisation de mot de passe.
 *
 * Contient le jeton de réinitialisation et le nouveau mot de passe
 * fournis par l'utilisateur pour finaliser la procédure.
 */
public class PasswordResetConfirmDto {

    /** Jeton unique permettant de valider la demande de réinitialisation. */
    private String token;

    /** Nouveau mot de passe choisi par l'utilisateur. */
    @NotBlank(message = "Le mot de passe est obligatoire.")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&]).{6,}$",
        message = "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial."
    )
    private String newPassword;

    /** Constructeur vide requis pour la désérialisation. */
    public PasswordResetConfirmDto() {}

    /**
     * Construit un DTO de confirmation de réinitialisation.
     *
     * @param token       jeton de validation
     * @param newPassword nouveau mot de passe
     */
    public PasswordResetConfirmDto(String token, String newPassword) {
        this.token = token;
        this.newPassword = newPassword;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
