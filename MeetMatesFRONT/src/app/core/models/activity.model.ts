/**
 * Représente une activité proposée dans le système.
 */
export interface Activity {
  id: string;
  name: string;
  categoryId?: string;
  imageUrl?: string;
}
