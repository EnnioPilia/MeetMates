export type EventFormMode = 'create' | 'edit';

export interface EventFormValue {
  title: string;
  description: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  material: string;
  level: string;
  activityId: string;
  status?: 'OPEN' | 'FULL' | 'CANCELLED' | 'FINISHED';
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
}
