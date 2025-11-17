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
