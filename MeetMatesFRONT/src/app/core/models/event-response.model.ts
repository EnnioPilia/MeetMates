/**
 * Représente la réponse d'un événement, utilisé pour les listes ou détails simplifiés.
 */
export interface EventResponse {
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

  /** Nombre maximum de participants */
  maxParticipants: number;

  /** Statut de l'événement (OPEN, FULL, CANCELLED, FINISHED) */
  status: string;

  /** Matériel requis pour l'événement */
  material: string;

  /** Niveau de l'événement (ex : débutant, intermédiaire, avancé) */
  level: string;

  /** Nom de l'activité associée */
  activityName: string;

  /** Identifiant de l'activité associée (optionnel si null) */
  activityId: string | null;

  /** Adresse affichable de l'événement */
  addressLabel: string;

  /** Nom de l'organisateur */
  organizerName: string;

  /** Identifiant de l'organisateur (optionnel si null) */
  organizerId: string | null;

  /** Noms des participants confirmés */
  participantNames: string[];

  /** Identifiant alternatif de l'événement (optionnel) */
  eventId?: string | number;

  /** Titre alternatif de l'événement (optionnel) */
  eventTitle?: string;

  /** Statut alternatif de l'événement (optionnel) */
  eventStatus?: string;

  /** Statut de participation de l'utilisateur courant (optionnel) */
  participationStatus?: string | null;

  /** URL de l'image associée à l'événement (optionnel) */
  imageUrl?: string | null;

  /** Détails de l'adresse (optionnel) */
  address?: {
    /** Rue et numéro */
    street: string;

    /** Ville */
    city: string;

    /** Code postal */
    postalCode: string;
  };
}
