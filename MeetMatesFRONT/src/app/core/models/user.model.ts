export interface User {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  role: string;       
  enabled: boolean; //changer en bloquer (corriger le back aussi)
  age?: number;
  dateCreation: string;   
  dateAcceptationCGU?: string;
  verifiedAt?: string;
  actif: boolean;
}
