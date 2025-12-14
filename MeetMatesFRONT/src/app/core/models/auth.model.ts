/**
 * Représente les données nécessaires pour l'inscription d'un utilisateur.
 */
export interface RegisterRequest {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  age?: number;
  role?: string;
}

/**
 * Représente les données pour demander une réinitialisation de mot de passe.
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Représente les données pour confirmer une réinitialisation de mot de passe.
 * Token reçu par email pour autentifier la réinitialisation 
 */
export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}
