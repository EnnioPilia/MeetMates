import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { EventResponse } from '../../models/event-response.model';
import { EventDetails } from '../../models/event-details.model';
import { EventRequest } from '../../models/event-request.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  fetchAllEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.baseUrl}/event`, { withCredentials: true });
  }

  fetchEventsByActivity(activityId: string): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.baseUrl}/event/activity/${activityId}`, { withCredentials: true });
  }

  fetchEventById(id: string): Observable<EventDetails> {
    return this.http.get<EventDetails>(`${this.baseUrl}/event/${id}`, { withCredentials: true });
  }

  createEvent(eventPayload: EventRequest): Observable<EventDetails> {
    return this.http.post<EventDetails>(`${this.baseUrl}/event`, eventPayload, { withCredentials: true });
  }
  
  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/event/${eventId}`, { withCredentials: true });
  }

  updateEvent(eventId: string, updatedEvent: Partial<EventDetails>): Observable<EventDetails> {
    return this.http.put<EventDetails>(`${this.baseUrl}/event/${eventId}`, updatedEvent, { withCredentials: true });
  }

  searchEvents(query: string): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.baseUrl}/event/search`, { params: { query }, withCredentials: true });
  }
}
