import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { EventResponse } from '../../models/event-response.model';
import { EventDetails } from '../../models/event-details.model';
import { EventRequest } from '../../models/event-request.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // FETCH ALL EVENTS
  fetchAllEvents(): Observable<EventResponse[]> {
    return this.http
      .get<{ message: string; data: EventResponse[] }>(`${this.baseUrl}/event`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  // FETCH EVENTS BY ACTIVITY
  fetchEventsByActivity(activityId: string): Observable<EventResponse[]> {
    return this.http
      .get<{ message: string; data: EventResponse[] }>(`${this.baseUrl}/event/activity/${activityId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  // FETCH EVENT DETAILS BY ID
  fetchEventById(id: string): Observable<EventDetails> {
    return this.http
      .get<{ message: string; data: EventDetails }>(`${this.baseUrl}/event/${id}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  // CREATE EVENT
  createEvent(eventPayload: EventRequest): Observable<EventDetails> {
    return this.http
      .post<{ message: string; data: EventDetails }>(`${this.baseUrl}/event`, eventPayload, { withCredentials: true })
      .pipe(map(res => res.data));
  }
  
  // DELETE EVENT
  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/event/${eventId}`, { withCredentials: true });
  }

  // UPDATE EVENT
  updateEvent(eventId: string, updatedEvent: Partial<EventDetails>): Observable<EventDetails> {
    return this.http
      .put<{ message: string; data: EventDetails }>(`${this.baseUrl}/event/${eventId}`, updatedEvent, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  // SEARCH EVENTS
  searchEvents(query: string): Observable<EventResponse[]> {
    return this.http
      .get<{ message: string; data: EventResponse[] }>(`${this.baseUrl}/event/search`, { params: { query }, withCredentials: true })
      .pipe(map(res => res.data));
  }
}
