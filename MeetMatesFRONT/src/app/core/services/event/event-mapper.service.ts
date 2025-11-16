import { Injectable } from '@angular/core';
import { EventResponse } from '../../models/event-response.model';
import { EventDetails } from '../../models/event-details.model';
import { EventListItem } from '../../models/event-list-item.model';

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
      acceptedParticipants: [],
      pendingParticipants: [],
      rejectedParticipants: [],
      activityId: response.activityId ?? null,
    };
  }

  toEventDetailsList(responses: EventResponse[]): EventDetails[] {
    return responses.map(r => this.toEventDetails(r));
  }

  toEventListItem(response: EventResponse): EventListItem {
    return {
      id: String(response.id),
      eventId: String(response.eventId ?? response.id),
      title: response.eventTitle ?? response.title ?? '',
      date: response.eventDate ?? '',
      status: response.eventStatus ?? response.status ?? '',
      participationStatus: response.participationStatus ?? null,
      activityName: response.activityName ?? '',
      addressLabel: response.addressLabel ?? '',
      imageUrl: response.imageUrl ?? null,
      activityId: String(response.activityId ?? ''),
    };
  }

  toEventList(responses: EventResponse[]): EventListItem[] {
    return responses.map(r => this.toEventListItem(r));
  }
}
