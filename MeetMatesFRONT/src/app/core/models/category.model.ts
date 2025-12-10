/**
 * Représente une catégorie d'activités.
 */
export interface Category {
  /** Identifiant unique de la catégorie */
  id: string;

  /** Nom affiché de la catégorie */
  name: string;

  /** URL de l'image représentant la catégorie (optionnel) */
  imageUrl?: string;
}
