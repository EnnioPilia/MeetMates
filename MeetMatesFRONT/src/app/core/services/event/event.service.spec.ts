import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EventService } from './event.service';
import { EventResponse } from '../../models/event-response.model';
import { EventDetails } from '../../models/event-details.model';
import { EventRequest } from '../../models/event-request.model';
import { ApiResponse } from '../../models/api-response.model';
import { environment } from '../../../../environments/environment';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ----------------------------------
  // fetchAllEvents
  // ----------------------------------
  it('should fetch all events', () => {
    const mockEvents: EventResponse[] = [
      { id: '1', title: 'Event 1' } as EventResponse
    ];

    const response: ApiResponse<EventResponse[]> = {
      message: 'OK',
      data: mockEvents
    };

    service.fetchAllEvents().subscribe(events => {
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${baseUrl}/event`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(response);
  });

  // ----------------------------------
  // fetchEventsByActivity
  // ----------------------------------
  it('should fetch events by activity', () => {
    const mockEvents: EventResponse[] = [
      { id: '2', title: 'Sport Event' } as EventResponse
    ];

    const response: ApiResponse<EventResponse[]> = {
      message: 'OK',
      data: mockEvents
    };

    service.fetchEventsByActivity('a1').subscribe(events => {
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${baseUrl}/event/activity/a1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(response);
  });

  // ----------------------------------
  // fetchEventById
  // ----------------------------------
  it('should fetch event details by id', () => {
    const eventDetails: EventDetails = {
      id: 'e1',
      title: 'Event',
      description: 'Desc',
      eventDate: '2024-01-01',
      startTime: '10:00',
      endTime: '12:00',
      addressLabel: 'Paris',
      address: { street: 'Rue', city: 'Paris', postalCode: '75000' },
      activityName: 'Sport',
      organizerName: 'John',
      level: 'Beginner',
      material: '',
      status: 'OPEN',
      maxParticipants: 10,
      participationStatus: null,
      acceptedParticipants: [],
      pendingParticipants: [],
      rejectedParticipants: [],
      activityId: 'a1'
    };

    const response: ApiResponse<EventDetails> = {
      message: 'OK',
      data: eventDetails
    };

    service.fetchEventById('e1').subscribe(event => {
      expect(event).toEqual(eventDetails);
    });

    const req = httpMock.expectOne(`${baseUrl}/event/e1`);
    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  // ----------------------------------
  // createEvent
  // ----------------------------------
  it('should create event', () => {
    const payload: EventRequest = { title: 'New Event' } as EventRequest;

    const response: ApiResponse<EventDetails> = {
      message: 'Created',
      data: {} as EventDetails
    };

    service.createEvent(payload).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${baseUrl}/event`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.body).toEqual(payload);

    req.flush(response);
  });

  // ----------------------------------
  // updateEvent
  // ----------------------------------
  it('should update event', () => {
    const payload: EventRequest = { title: 'Updated Event' } as EventRequest;

    const response: ApiResponse<EventDetails> = {
      message: 'Updated',
      data: {} as EventDetails
    };

    service.updateEvent('e1', payload).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${baseUrl}/event/e1`);
    expect(req.request.method).toBe('PUT');

    req.flush(response);
  });

  // ----------------------------------
  // deleteEvent
  // ----------------------------------
  it('should delete event', () => {
    const response: ApiResponse<void> = {
      message: 'Deleted',
      data: undefined
    };

    service.deleteEvent('e1').subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${baseUrl}/event/e1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(response);
  });

  // ----------------------------------
  // searchEvents
  // ----------------------------------
  it('should search events', () => {
    const mockEvents: EventResponse[] = [
      { id: '3', title: 'Search Event' } as EventResponse
    ];

    const response: ApiResponse<EventResponse[]> = {
      message: 'OK',
      data: mockEvents
    };

    service.searchEvents('sport').subscribe(events => {
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === `${baseUrl}/event/search` &&
      req.params.get('query') === 'sport'
    );

    expect(req.request.withCredentials).toBeTrue();

    req.flush(response);
  });
});
