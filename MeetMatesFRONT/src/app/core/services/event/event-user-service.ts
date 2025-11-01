import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventUserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  joinEvent(eventId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/event-user/join`, { eventId, userId }, { withCredentials: true });
  }
}
