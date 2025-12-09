package com.example.meetmates.dto;

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

    /** Retourne le jeton de réinitialisation.
     * @return token
     */
    public String getToken() {
        return token;
    }

    /** Définit le jeton de réinitialisation.
     * @param token jeton reçu par email
     */
    public void setToken(String token) {
        this.token = token;
    }

    /** Retourne le nouveau mot de passe.
     * @return nouveau mot de passe
     */
    public String getNewPassword() {
        return newPassword;
    }

    /** Définit le nouveau mot de passe.
     * @param newPassword mot de passe choisi
     */
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
