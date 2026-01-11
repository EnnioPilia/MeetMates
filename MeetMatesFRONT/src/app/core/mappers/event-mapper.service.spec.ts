import { TestBed } from '@angular/core/testing';
import { EventMapperService } from './event-mapper';
import { EventResponse } from '../models/event-response.model';

describe('EventMapperService', () => {
  let service: EventMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventMapperService);
  });

  describe('toEventDetails', () => {

    it('should map EventResponse to EventDetails with defaults', () => {
      const response: EventResponse = {
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
        activityName: 'Football',
        activityId: 'activity-1',
        addressLabel: 'Rue test',
        organizerName: 'John',
        organizerId: 'org-1',
        participantNames: [],
        address: {
          street: 'Rue test',
          city: 'Paris',
          postalCode: '75000'
        }
      };

      const result = service.toEventDetails(response);

      expect(result).toEqual({
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
        addressLabel: 'Rue test',
        address: {
          street: 'Rue test',
          city: 'Paris',
          postalCode: '75000'
        },
        activityName: 'Football',
        organizerName: 'John',
        participationStatus: null,
        acceptedParticipants: [],
        pendingParticipants: [],
        rejectedParticipants: [],
        activityId: 'activity-1'
      });
    });

    it('should provide empty address when missing', () => {
      const response: EventResponse = {
        id: '1',
        title: 'Event',
        description: '',
        eventDate: '2025-01-10',
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 10,
        status: 'OPEN',
        material: 'PROVIDED',
        level: 'BEGINNER',
        activityName: '',
        activityId: null,
        addressLabel: '',
        organizerName: '',
        organizerId: null,
        participantNames: []
      };

      const result = service.toEventDetails(response);

      expect(result.address).toEqual({
        street: '',
        city: '',
        postalCode: ''
      });
    });
  });

  describe('toEventDetailsList', () => {

    it('should map a list of EventResponse', () => {
      const responses: EventResponse[] = [
        {
          id: '1',
          title: 'Event 1',
          description: '',
          eventDate: '2025-01-10',
          startTime: '10:00',
          endTime: '12:00',
          maxParticipants: 10,
          status: 'OPEN',
          material: '',
          level: '',
          activityName: '',
          activityId: null,
          addressLabel: '',
          organizerName: '',
          organizerId: null,
          participantNames: []
        }
      ];

      const result = service.toEventDetailsList(responses);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('toEventListItem', () => {

    it('should map EventResponse to EventListItem using fallback fields', () => {
      const response: EventResponse = {
        id: '1',
        title: 'Event',
        description: '',
        eventDate: '2025-01-10',
        startTime: '',
        endTime: '',
        maxParticipants: 10,
        status: 'OPEN',
        material: '',
        level: '',
        activityName: 'Football',
        activityId: 'activity-1',
        addressLabel: '',
        organizerName: '',
        organizerId: null,
        participantNames: [],
        eventId: 99,
        eventTitle: 'Alt title',
        eventStatus: 'FULL',
        participationStatus: 'ACCEPTED',
        address: {
          street: 'Rue test',
          city: 'Paris',
          postalCode: '75000'
        }
      };

      const result = service.toEventListItem(response);

      expect(result).toEqual({
        id: '1',
        eventId: '99',
        title: 'Alt title',
        date: '2025-01-10',
        status: 'FULL',
        participationStatus: 'ACCEPTED',
        activityName: 'Football',
        addressLabel: 'Rue test, 75000 Paris',
        imageUrl: null,
        activityId: 'activity-1'
      });
    });

    it('should handle missing optional fields', () => {
      const response: EventResponse = {
        id: '1',
        title: 'Event',
        description: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        maxParticipants: 0,
        status: '',
        material: '',
        level: '',
        activityName: '',
        activityId: null,
        addressLabel: '',
        organizerName: '',
        organizerId: null,
        participantNames: []
      };

      const result = service.toEventListItem(response);

      expect(result.title).toBe('Event');
      expect(result.addressLabel).toBe('');
    });
  });

  describe('toEventList', () => {

    it('should map a list of EventResponse to EventListItem[]', () => {
      const responses: EventResponse[] = [
        {
          id: '1',
          title: 'Event',
          description: '',
          eventDate: '',
          startTime: '',
          endTime: '',
          maxParticipants: 0,
          status: '',
          material: '',
          level: '',
          activityName: '',
          activityId: null,
          addressLabel: '',
          organizerName: '',
          organizerId: null,
          participantNames: []
        }
      ];

      const result = service.toEventList(responses);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });
  });
});
