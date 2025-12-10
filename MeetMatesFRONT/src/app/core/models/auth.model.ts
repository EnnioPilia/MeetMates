/**
 * Représente les données nécessaires pour l'inscription d'un utilisateur.
 */
export interface RegisterRequest {
  /** Nom de famille de l'utilisateur */
  lastName: string;

  /** Prénom de l'utilisateur */
  firstName: string;

  /** Adresse email de l'utilisateur */
  email: string;

  /** Mot de passe de l'utilisateur */
  password: string;

  /** Âge de l'utilisateur (optionnel) */
  age?: number;

  /** Rôle de l'utilisateur (optionnel) */
  role?: string;
}

/**
 * Représente les données pour demander une réinitialisation de mot de passe.
 */
export interface PasswordResetRequest {
  /** Adresse email de l'utilisateur */
  email: string;
}

/**
 * Représente les données pour confirmer une réinitialisation de mot de passe.
 */
export interface PasswordResetConfirmRequest {
  /** Token reçu par email pour confirmer la réinitialisation */
  token: string;

  /** Nouveau mot de passe */
  newPassword: string;
}
