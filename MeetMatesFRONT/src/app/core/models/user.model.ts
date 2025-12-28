/**
 * Représente un utilisateur de l'application.
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  city: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED' | 'DELETED';
  profilePictureUrl: string | null;
  deletedAt?: string | null;
  
}
