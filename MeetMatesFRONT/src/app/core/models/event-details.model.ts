import { EventUser } from './event-user.model';

/**
 * Représente les détails complets d'un événement.
 */
export interface EventDetails {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  addressLabel: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  activityName: string;
  organizerName: string;
  level: string;
  material: string;
  status: string;
  maxParticipants: number;
  participationStatus: string | null;
  acceptedParticipants: EventUser[];
  pendingParticipants: EventUser[];
  rejectedParticipants: EventUser[];
  activityId: string | null;
}
