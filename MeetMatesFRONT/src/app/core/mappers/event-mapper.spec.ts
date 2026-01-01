import { EventMapperService } from '../mappers/event-mapper';
import { EventResponse } from '../models/event-response.model';

describe('EventMapperService', () => {
  let service: EventMapperService;

  beforeEach(() => {
    service = new EventMapperService();
  });

  it('should map API response to EventDetails with default values', () => {
    const response = {
      id: '1',
      title: 'Event',
      description: 'Desc',
      eventDate: '2025-01-10',
      startTime: '10:00',
      endTime: '12:00',
      maxParticipants: 10,
      status: 'OPEN',
      material: 'PROVIDED',
      level: 'BEGINNER',
      addressLabel: '',
      activityName: 'Yoga',
      organizerName: 'John',
    } as EventResponse;

    const result = service.toEventDetails(response);

    expect(result.acceptedParticipants).toEqual([]);
    expect(result.pendingParticipants).toEqual([]);
    expect(result.rejectedParticipants).toEqual([]);
    expect(result.participationStatus).toBeNull();
    expect(result.address).toBeDefined();
  });

  it('should map a list of EventResponse to EventDetails list', () => {
    const responses = [{ id: '1' }, { id: '2' }] as EventResponse[];

    const result = service.toEventDetailsList(responses);

    expect(result.length).toBe(2);
    expect(result[0].id).toBe('1');
  });

  it('should map API response to EventListItem with formatted address', () => {
    const response = {
      id: '1',
      title: 'Event',
      eventDate: '2025-01-10',
      status: 'OPEN',
      address: {
        street: '1 rue test',
        postalCode: '75000',
        city: 'Paris'
      }
    } as EventResponse;

    const result = service.toEventListItem(response);

    expect(result.addressLabel).toContain('Paris');
    expect(result.status).toBe('OPEN');
    expect(result.title).toBe('Event');
  });
});
