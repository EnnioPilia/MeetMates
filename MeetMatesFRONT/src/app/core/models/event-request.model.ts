/**
 * Représente les données nécessaires pour créer ou mettre à jour un événement.
 */
export interface EventRequest {
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

  /** Statut de l'événement (ex : OPEN, FULL, CANCELLED, FINISHED) */
  status: string;

  /** Matériel requis pour l'événement */
  material: string;

  /** Niveau de l'événement (ex : débutant, intermédiaire, avancé) */
  level: string;

  /** Identifiant de l'activité associée */
  activityId: string;

  /** Adresse de l'événement */
  address: {
    /** Rue et numéro (optionnel) */
    street?: string;

    /** Ville (optionnel) */
    city?: string;

    /** Code postal (optionnel) */
    postalCode?: string;

    /** Pays (optionnel) */
    country?: string;
  };
}
