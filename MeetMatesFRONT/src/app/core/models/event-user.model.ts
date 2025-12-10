/**
 * Représente un utilisateur participant à un événement.
 */
export interface EventUser {
  /** Identifiant unique de la participation */
  id: string;

  /** Identifiant de l'événement associé */
  eventId: string;

  /** Titre de l'événement */
  eventTitle: string;

  /** Description de l'événement */
  eventDescription: string;

  /** Identifiant de l'utilisateur */
  userId: string;

  /** Prénom de l'utilisateur */
  firstName: string;

  /** Nom de famille de l'utilisateur */
  lastName: string;

  /** Email de l'utilisateur */
  email: string;

  /** Rôle de l'utilisateur (participant, organisateur) */
  role: string;

  /** Statut de participation de l'utilisateur (ACCEPTED, PENDING, REJECTED) */
  participationStatus: string;

  /** Date et heure de participation (optionnel, format ISO) */
  joinedAt?: string;

  /** Statut actuel de l'événement (OPEN, FULL, CANCELLED, FINISHED) */
  eventStatus: string;

  /** Date de l'événement (format ISO) */
  eventDate: string;

  /** Adresse affichable de l'événement */
  addressLabel: string;
}
