/**
 * Représente un élément de la liste d'événements, utilisé par exemple
 * pour l'affichage dans un tableau ou une liste compacte.
 */
export interface EventListItem {
  /** Identifiant unique de l'objet EventListItem */
  id: string;

  /** Identifiant de l'événement correspondant */
  eventId: string;

  /** Titre de l'événement */
  title: string;

  /** Date de l'événement (format ISO ou affichable) */
  date: string;

  /** Statut de l'événement (ex : OPEN, FULL, CANCELLED, FINISHED) */
  status: string;

  /** Statut de participation de l'utilisateur courant (optionnel) */
  participationStatus: string | null;

  /** Nom de l'activité associée à l'événement */
  activityName: string;

  /** Adresse affichable de l'événement */
  addressLabel: string;

  /** URL de l'image associée à l'événement (optionnel) */
  imageUrl?: string | null;

  /** Identifiant de l'activité associée */
  activityId: string;
}
