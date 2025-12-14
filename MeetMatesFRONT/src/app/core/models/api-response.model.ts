/**
 * Modèle générique de réponse d'API.
 * 
 * @template T Type des données renvoyées par l'API.
 */
export interface ApiResponse<T> {
  message: string;
  data: T;
}
