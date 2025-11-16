import { EventUser } from './event-user.model';

export interface EventDetails {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  addressLabel: string;
  activityName: string;
  organizerName: string;
  level: string;
  material: string;
  status: string;
  maxParticipants: number;
  participationStatus: string | null;
  acceptedParticipants: EventUser[];
  pendingParticipants: EventUser[];
  rejectedParticipants: EventUser[];
  activityId: string | null;
}
