import { EventFormMapper } from './event-form.mapper';
import { EventFormValue } from '../../core/models/event-form.model';
import { EventDetails } from '../../core/models/event-details.model';

describe('EventFormMapper', () => {

  describe('toCreateRequest', () => {

    it('should map form values and force status to OPEN', () => {
      const form: EventFormValue = {
        title: 'Event',
        description: 'Desc',
        eventDate: new Date(2025, 0, 10),
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 10,
        material: 'PROVIDED',
        level: 'BEGINNER',
        activityId: 'activity-1',
        address: {
          street: 'Rue test',
          city: 'Paris',
          postalCode: '75000'
        },
        status: undefined
      };

      const result = EventFormMapper.toCreateRequest(form);

      expect(result).toEqual({
        title: 'Event',
        description: 'Desc',
        eventDate: '2025-01-10',
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 10,
        material: 'PROVIDED',
        level: 'BEGINNER',
        activityId: 'activity-1',
        address: {
          street: 'Rue test',
          city: 'Paris',
          postalCode: '75000'
        },
        status: 'OPEN'
      });
    });
  });

  describe('toUpdateRequest', () => {

    it('should use form status when provided', () => {
      const form: EventFormValue = {
        title: 'Event',
        description: 'Desc',
        eventDate: new Date(2025, 0, 10),
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 10,
        material: 'PROVIDED',
        level: 'BEGINNER',
        activityId: 'activity-1',
        address: {
          street: 'Rue test',
          city: 'Paris',
          postalCode: '75000'
        },
        status: 'FULL'
      };

      const result = EventFormMapper.toUpdateRequest(form, 'OPEN');

      expect(result.status).toBe('FULL');
    });

    it('should keep existing status when form status is undefined', () => {
      const form: EventFormValue = {
        title: 'Event',
        description: 'Desc',
        eventDate: new Date(2025, 0, 10),
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 10,
        material: 'PROVIDED',
        level: 'BEGINNER',
        activityId: 'activity-1',
        address: {
          street: 'Rue test',
          city: 'Paris',
          postalCode: '75000'
        },
        status: undefined
      };

      const result = EventFormMapper.toUpdateRequest(form, 'CANCELLED');

      expect(result.status).toBe('CANCELLED');
    });
  });

  describe('toFormValue', () => {

    it('should map EventDetails to form values', () => {
      const event: EventDetails = {
        id: '1',
        title: 'Event',
        description: 'Desc',
        eventDate: '2025-01-10',
        startTime: '10:00',
        endTime: '12:00',
        addressLabel: 'Rue test, Paris',
        address: {
          street: 'Rue test',
          city: 'Paris',
          postalCode: '75000'
        },
        activityName: 'Football',
        organizerName: 'John Doe',
        level: 'BEGINNER',
        material: 'PROVIDED',
        status: 'OPEN',
        maxParticipants: 10,
        participationStatus: null,
        acceptedParticipants: [],
        pendingParticipants: [],
        rejectedParticipants: [],
        activityId: 'activity-1'
      };

      const result = EventFormMapper.toFormValue(event);

      expect(result).toEqual({
        title: 'Event',
        description: 'Desc',
        eventDate: new Date(2025, 0, 10),
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 10,
        material: 'PROVIDED',
        level: 'BEGINNER',
        activityId: 'activity-1',
        address: {
          street: 'Rue test',
          city: 'Paris',
          postalCode: '75000'
        },
        status: 'OPEN'
      });
    });

    it('should ignore invalid status', () => {
      const event: EventDetails = {
        id: '1',
        title: 'Event',
        description: 'Desc',
        eventDate: '2025-01-10',
        startTime: '10:00',
        endTime: '12:00',
        addressLabel: '',
        address: {
          street: '',
          city: '',
          postalCode: ''
        },
        activityName: '',
        organizerName: '',
        level: 'BEGINNER',
        material: 'PROVIDED',
        status: 'UNKNOWN',
        maxParticipants: 10,
        participationStatus: null,
        acceptedParticipants: [],
        pendingParticipants: [],
        rejectedParticipants: [],
        activityId: 'activity-1'
      };

      const result = EventFormMapper.toFormValue(event);

      expect(result.status).toBeUndefined();
    });
  });
});
