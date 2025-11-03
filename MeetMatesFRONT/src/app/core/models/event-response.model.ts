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
  activityId: string | null;
  addressLabel: string;
  organizerName: string;
  participantNames: string[];
}
