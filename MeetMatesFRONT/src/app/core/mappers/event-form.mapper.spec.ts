import { EventFormMapper } from './event-form.mapper';
import { EventFormValue } from '../models/event-form.model';
import { EventDetails } from '../models/event-details.model';

describe('EventFormMapper', () => {

  it('should map form values to create EventRequest with OPEN status', () => {
    const form: EventFormValue = {
      title: 'Event',
      description: 'Description',
      eventDate: new Date(2025, 0, 10),
      startTime: '10:00',
      endTime: '12:00',
      maxParticipants: 10,
      material: 'PROVIDED',
      level: 'BEGINNER',
      activityId: '1',
      address: {
        street: '1 rue test',
        city: 'Paris',
        postalCode: '75000'
      },
      status: undefined
    };

    const result = EventFormMapper.toCreateRequest(form);

    expect(result.title).toBe('Event');
    expect(result.description).toBe('Description');
    expect(result.status).toBe('OPEN');
    expect(result.material).toBe('PROVIDED');
    expect(result.level).toBe('BEGINNER');
    expect(result.address.city).toBe('Paris');
    expect(result.eventDate).toBeDefined();
  });

  it('should map form values to update EventRequest using form status when provided', () => {
    const form: EventFormValue = {
      title: 'Event',
      description: 'Description',
      eventDate: new Date(2025, 0, 10),
      startTime: '10:00',
      endTime: '12:00',
      maxParticipants: 10,
      material: 'YOUR_OWN',
      level: 'INTERMEDIATE',
      activityId: '1',
      address: {
        street: '2 rue test',
        city: 'Lyon',
        postalCode: '69000'
      },
      status: 'CANCELLED'
    };

    const result = EventFormMapper.toUpdateRequest(form, 'OPEN');

    expect(result.status).toBe('CANCELLED');
    expect(result.material).toBe('YOUR_OWN');
    expect(result.level).toBe('INTERMEDIATE');
  });

  it('should map API event details to form values with valid status', () => {
    const event = {
      title: 'Event',
      description: 'Description',
      eventDate: '2025-01-10',
      startTime: '10:00',
      endTime: '12:00',
      maxParticipants: 10,
      material: 'NOT_REQUIRED',
      level: 'ALL_LEVELS',
      activityId: '1',
      address: {
        street: '3 rue test',
        city: 'Marseille',
        postalCode: '13000'
      },
      status: 'OPEN'
    } as EventDetails;

    const form = EventFormMapper.toFormValue(event);

    expect(form.status).toBe('OPEN');
    expect(form.material).toBe('NOT_REQUIRED');
    expect(form.level).toBe('ALL_LEVELS');
    expect(form.eventDate instanceof Date).toBeTrue();
    expect(form.address.city).toBe('Marseille');
  });

  it('should ignore invalid status when mapping API event details to form values', () => {
    const event = {
      title: 'Event',
      description: 'Description',
      eventDate: '2025-01-10',
      startTime: '10:00',
      endTime: '12:00',
      maxParticipants: 10,
      material: 'PROVIDED',
      level: 'EXPERT',
      activityId: '1',
      address: {
        street: '4 rue test',
        city: 'Nice',
        postalCode: '06000'
      },
      status: 'INVALID_STATUS'
    } as EventDetails;

    const form = EventFormMapper.toFormValue(event);

    expect(form.status).toBeUndefined();
  });

});
