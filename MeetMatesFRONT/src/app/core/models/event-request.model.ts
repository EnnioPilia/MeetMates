/**
 * Représente les données nécessaires pour créer ou mettre à jour un événement.
 */
export interface EventRequest {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  status: string;
  material: string;
  level: string;
  activityId: string;
  address: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}
