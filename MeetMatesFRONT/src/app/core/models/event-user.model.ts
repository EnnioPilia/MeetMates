/**
 * Représente un utilisateur participant à un événement.
 */
export interface EventUser {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  participationStatus: string;
  joinedAt?: string;
  eventStatus: string;
  eventDate: string;
  addressLabel: string;
}
