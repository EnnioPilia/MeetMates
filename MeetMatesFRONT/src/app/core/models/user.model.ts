/**
 * Représente un utilisateur de l'application.
 */
export interface User {
  /** Identifiant unique de l'utilisateur */
  id: string;

  /** Prénom de l'utilisateur */
  firstName: string;

  /** Nom de famille de l'utilisateur */
  lastName: string;

  /** Adresse email de l'utilisateur */
  email: string;

  /** Âge de l'utilisateur */
  age: number;

  /** Ville de résidence de l'utilisateur */
  city: string;

  /** URL de la photo de profil (optionnel, null si aucune photo) */
  profilePictureUrl: string | null;
}
