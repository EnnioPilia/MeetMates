import { EventFormValue } from '../../core/models/event-form.model';
import { EventRequest } from '../../core/models/event-request.model';
import { EventDetails } from '../../core/models/event-details.model';
import { formatLocalDate } from '../../core/utils/date.utils';

export class EventFormMapper {

  static toCreateRequest(form: EventFormValue): EventRequest {
    return {
      title: form.title,
      description: form.description,
      eventDate: formatLocalDate(form.eventDate),
      startTime: form.startTime,
      endTime: form.endTime,
      maxParticipants: form.maxParticipants,
      material: form.material,
      level: form.level,
      activityId: form.activityId,
      address: form.address,
      status: 'OPEN',
    };
  }

  static toUpdateRequest(
    form: EventFormValue,
    existingStatus: EventRequest['status']
  ): EventRequest {
    return {
      title: form.title,
      description: form.description,
      eventDate: formatLocalDate(form.eventDate),
      startTime: form.startTime,
      endTime: form.endTime,
      maxParticipants: form.maxParticipants,
      material: form.material,
      level: form.level,
      activityId: form.activityId,
      address: form.address,
      status: form.status ?? existingStatus,
    };
  }

  static toFormValue(event: EventDetails): EventFormValue {

    const allowedStatuses = ['OPEN', 'FULL', 'CANCELLED', 'FINISHED',] as const;

    type AllowedStatus = typeof allowedStatuses[number];

    const status = allowedStatuses.includes(event.status as AllowedStatus)
      ? (event.status as AllowedStatus) : undefined;

    const [year, month, day] = event.eventDate.split('-').map(Number);

    return {
      title: event.title,
      description: event.description,
      eventDate: new Date(year, month - 1, day),
      startTime: event.startTime,
      endTime: event.endTime,
      maxParticipants: event.maxParticipants,
      material: event.material,
      level: event.level,
      activityId: event.activityId ?? '',
      address: event.address,
      status,
    };
  }

}
