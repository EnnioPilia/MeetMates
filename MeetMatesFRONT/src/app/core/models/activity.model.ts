/**
 * Représente une activité proposée dans le système.
 */
export interface Activity {
  /** Identifiant unique de l'activité */
  id: string;

  /** Nom affiché de l'activité */
  name: string;

  /** Identifiant de la catégorie associée (optionnel) */
  categoryId?: string;

  /** URL d'image illustrant l'activité (optionnel) */
  imageUrl?: string;
}
