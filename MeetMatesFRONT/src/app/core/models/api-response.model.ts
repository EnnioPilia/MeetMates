/**
 * Modèle générique de réponse d'API.
 *
 * @template T Type des données renvoyées par l'API.
 */
export interface ApiResponse<T> {
  /** Message descriptif de l'opération (succès ou erreur) */
  message: string;

  /** Données renvoyées par l'API */
  data: T;
}
