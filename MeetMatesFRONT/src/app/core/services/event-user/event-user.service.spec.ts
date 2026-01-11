// Angular
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

// Environment
import { environment } from '../../../../environments/environment';

// Service
import { EventUserService } from './event-user.service';

// Models
import { ApiResponse } from '../../models/api-response.model';
import { EventResponse } from '../../models/event-response.model';

describe('EventUserService', () => {
  let service: EventUserService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventUserService]
    });

    service = TestBed.inject(EventUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ----------------------------
  // joinEvent
  // ----------------------------
  it('should send POST request to join event', () => {
    const eventId = 'e1';
    const mockResponse: ApiResponse<void> = {
      message: 'Joined',
      data: undefined
    };

    service.joinEvent(eventId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/event-user/${eventId}/join`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(mockResponse);
  });

  // ----------------------------
  // acceptParticipant
  // ----------------------------
  it('should accept participant', () => {
    const eventUserId = 'eu1';
    const mockResponse: ApiResponse<void> = {
      message: 'Accepted',
      data: undefined
    };

    service.acceptParticipant(eventUserId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/event-user/${eventUserId}/accept`
    );
    expect(req.request.method).toBe('PUT');

    req.flush(mockResponse);
  });

  // ----------------------------
  // rejectParticipant
  // ----------------------------
  it('should reject participant', () => {
    const eventUserId = 'eu2';
    const mockResponse: ApiResponse<void> = {
      message: 'Rejected',
      data: undefined
    };

    service.rejectParticipant(eventUserId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/event-user/${eventUserId}/reject`
    );
    expect(req.request.method).toBe('PUT');

    req.flush(mockResponse);
  });

  // ----------------------------
  // removeParticipant
  // ----------------------------
  it('should remove participant from event', () => {
    const eventId = 'e1';
    const userId = 'u1';
    const mockResponse: ApiResponse<void> = {
      message: 'Removed',
      data: undefined
    };

    service.removeParticipant(eventId, userId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/event-user/${eventId}/participants/${userId}`
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  // ----------------------------
  // leaveEvent
  // ----------------------------
  it('should leave event', () => {
    const eventId = 'e2';
    const mockResponse: ApiResponse<void> = {
      message: 'Left event',
      data: undefined
    };

    service.leaveEvent(eventId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/event-user/${eventId}/leave`
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  // ----------------------------
  // getOrganizedEvents
  // ----------------------------
  it('should fetch organized events', () => {
    const events: EventResponse[] = [
      { id: '1', title: 'Event 1' } as EventResponse
    ];

    service.getOrganizedEvents().subscribe(res => {
      expect(res).toEqual(events);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/event-user/organized`
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      message: 'OK',
      data: events
    });
  });

  // ----------------------------
  // getParticipatingEvents
  // ----------------------------
  it('should fetch participating events', () => {
    const events: EventResponse[] = [
      { id: '2', title: 'Event 2' } as EventResponse
    ];

    service.getParticipatingEvents().subscribe(res => {
      expect(res).toEqual(events);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/event-user/participating`
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      message: 'OK',
      data: events
    });
  });
});
