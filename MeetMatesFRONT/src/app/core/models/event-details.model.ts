import { EventUser } from './event-user.model';

/**
 * Représente les détails complets d'un événement.
 */
export interface EventDetails {
  /** Identifiant unique de l'événement */
  id: string;

  /** Titre de l'événement */
  title: string;

  /** Description détaillée de l'événement */
  description: string;

  /** Date de l'événement (format ISO) */
  eventDate: string;

  /** Heure de début de l'événement (format HH:mm) */
  startTime: string;

  /** Heure de fin de l'événement (format HH:mm) */
  endTime: string;

  /** Adresse complète sous forme de label */
  addressLabel: string;

  /** Détails de l'adresse de l'événement */
  address: {
    /** Rue et numéro */
    street: string;
    /** Ville */
    city: string;
    /** Code postal */
    postalCode: string;
  };

  /** Nom de l'activité associée */
  activityName: string;

  /** Nom de l'organisateur */
  organizerName: string;

  /** Niveau de l'événement (ex : débutant, intermédiaire, avancé) */
  level: string;

  /** Matériel requis pour l'événement */
  material: string;

  /** Statut de l'événement (ex : OPEN, FULL, CANCELLED, FINISHED) */
  status: string;

  /** Nombre maximum de participants */
  maxParticipants: number;

  /** Statut de participation de l'utilisateur courant (optionnel) */
  participationStatus: string | null;

  /** Liste des participants acceptés */
  acceptedParticipants: EventUser[];

  /** Liste des participants en attente de validation */
  pendingParticipants: EventUser[];

  /** Liste des participants refusés */
  rejectedParticipants: EventUser[];

  /** Identifiant de l'activité associée (optionnel) */
  activityId: string | null;
}
