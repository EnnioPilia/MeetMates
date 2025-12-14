/**
 * Représente un élément de la liste d'événements, utilisé par exemple
 * pour l'affichage dans un tableau ou une liste compacte.
 */
export interface EventListItem {
  id: string;
  eventId: string;
  title: string;
  date: string;
  status: string;
  participationStatus: string | null;
  activityName: string;
  addressLabel: string;
  imageUrl?: string | null;
  activityId: string;
}
