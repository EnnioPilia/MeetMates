export interface EventListItem {
  id: string;        // généralement l’ID EventUser
  eventId: string;   // ID de l’ÉVÉNEMENT → OBLIGATOIRE
  title: string;
  date: string;
  status: string;
  participationStatus: string | null;
  activityName: string;
  addressLabel: string;
  imageUrl?: string | null;
  activityId: string;   // ← doit exister !
}
