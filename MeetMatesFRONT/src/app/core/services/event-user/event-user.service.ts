import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EventResponse } from '../../models/event-response.model';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../models/api-response.model'; 

@Injectable({
  providedIn: 'root'
})
export class EventUserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

joinEvent(eventId: string): Observable<ApiResponse<void>> {
  return this.http.post<ApiResponse<void>>(
    `${this.baseUrl}/event-user/${eventId}/join`,
    {},
    { withCredentials: true }
  );
}

acceptParticipant(eventUserId: string): Observable<ApiResponse<void>> {
  return this.http.put<ApiResponse<void>>(
    `${this.baseUrl}/event-user/${eventUserId}/accept`,
    {},
    { withCredentials: true }
  );
}

rejectParticipant(eventUserId: string): Observable<ApiResponse<void>> {
  return this.http.put<ApiResponse<void>>(
    `${this.baseUrl}/event-user/${eventUserId}/reject`,
    {},
    { withCredentials: true }
  );
}

removeParticipant(eventId: string, userId: string): Observable<ApiResponse<void>> {
  return this.http.delete<ApiResponse<void>>(
    `${this.baseUrl}/event-user/${eventId}/participants/${userId}`,
    { withCredentials: true }
  );
}

leaveEvent(eventId: string): Observable<ApiResponse<void>> {
  return this.http.delete<ApiResponse<void>>(
    `${this.baseUrl}/event-user/${eventId}/leave`,
    { withCredentials: true }
  );
}

getOrganizedEvents(): Observable<EventResponse[]> {
  return this.http.get<ApiResponse<EventResponse[]>>(
      `${this.baseUrl}/event-user/organized`,
      { withCredentials: true }
    ).pipe(
      map(res => res.data ?? []) // retourne un tableau TS-safe
    );
}

getParticipatingEvents(): Observable<EventResponse[]> {
  return this.http.get<ApiResponse<EventResponse[]>>(
      `${this.baseUrl}/event-user/participating`,
      { withCredentials: true }
    ).pipe(
      map(res => res.data ?? [])
    );
}
}
