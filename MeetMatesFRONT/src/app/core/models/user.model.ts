export interface User {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  role: string;       
  enabled: boolean; 
  age?: number;
  dateCreation: string;   
  dateAcceptationCGU?: string;
  verifiedAt?: string;
  actif: boolean;
  avatarUrl?: string; 
  profilePictureUrl?: string | null;
}
