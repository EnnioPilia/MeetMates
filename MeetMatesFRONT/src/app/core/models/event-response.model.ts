export interface EventResponse {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  status: string;
  material: string;
  level: string;
  activityName: string;
  addressLabel: string;
  organizerName: string;
  participantNames: string[];
  imageUrl?: string;
}
