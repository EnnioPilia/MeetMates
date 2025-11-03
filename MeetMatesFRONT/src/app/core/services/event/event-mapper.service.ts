import { Injectable } from '@angular/core';
import { EventResponse } from '../../models/event-response.model';
import { EventDetails } from '../../models/event-details.model';
import { EventUser } from '../../models/event-user.model';

@Injectable({ providedIn: 'root' })
export class EventMapperService {

  toEventDetails(response: EventResponse): EventDetails {
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      eventDate: response.eventDate,
      startTime: response.startTime,
      endTime: response.endTime,
      maxParticipants: response.maxParticipants,
      status: response.status,
      material: response.material,
      level: response.level,
      addressLabel: response.addressLabel,
      activityName: response.activityName,
      organizerName: response.organizerName,
      participationStatus: null,
      acceptedParticipants: (response.participantNames ?? []).map(name => this.toFakeUser(name)),
      pendingParticipants: [],
      rejectedParticipants: [],
      activityId: response.activityId ?? null,
    };
  }

  private toFakeUser(name: string): EventUser {
    return {
      id: crypto.randomUUID(),
      eventId: '',
      eventTitle: '',
      eventDescription: '',
      userId: '',
      firstName: name,
      lastName: '',
      email: '',
      role: 'PARTICIPANT',
      participationStatus: 'ACCEPTED',
      joinedAt: '',
      eventStatus: '',
      eventDate: '',
      addressLabel: ''
    };
  }

  toEventDetailsList(responses: EventResponse[]): EventDetails[] {
    return responses.map(r => this.toEventDetails(r));
  }
}
