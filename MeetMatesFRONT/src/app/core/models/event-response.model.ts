/**
 * Représente la réponse d'un événement, utilisé pour les listes ou détails simplifiés.
 */
export interface EventResponse {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  status: string;
  material: string;
  level: string;
  activityName: string;
  activityId: string | null;
  addressLabel: string;
  organizerName: string;
  organizerId: string | null;
  participantNames: string[];
  eventId?: string | number;
  eventTitle?: string;
  eventStatus?: string;
  participationStatus?: string | null;
  imageUrl?: string | null;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
}
