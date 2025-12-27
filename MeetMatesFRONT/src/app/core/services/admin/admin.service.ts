import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../../models/user.model';
import { EventResponse } from '../../models/event-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /* ================= USERS ================= */

  /** ADMIN – récupérer tous les utilisateurs */
  getAllUsers(): Observable<{ message: string; data: User[] }> {
    return this.http.get<{ message: string; data: User[] }>(
      `${this.baseUrl}/admin/users`
    );
  }

  /** ADMIN – soft delete utilisateur */
  softDeleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/users/${userId}`
    );
  }

  /** ADMIN – hard delete utilisateur */
  hardDeleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/users/${userId}/hard`
    );
  }
/** ADMIN – restore utilisateur */
restoreUser(userId: string): Observable<{ message: string }> {
  return this.http.put<{ message: string }>(
    `${this.baseUrl}/admin/users/${userId}/restore`,
    {}
  );
}

  /* ================= EVENTS ================= */

  /** ADMIN – récupérer tous les événements */
  getAllEvents(): Observable<{ message: string; data: EventResponse[] }> {
    return this.http.get<{ message: string; data: EventResponse[] }>(
      `${this.baseUrl}/admin/events`
    );
  }

  /** ADMIN – soft delete événement */
  softDeleteEvent(eventId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/events/${eventId}`
    );
  }

  /** ADMIN – hard delete événement */
  hardDeleteEvent(eventId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/events/${eventId}/hard`
    );
  }

  /** ADMIN – restore événement */
restoreEvent(eventId: string): Observable<{ message: string }> {
  return this.http.put<{ message: string }>(
    `${this.baseUrl}/admin/events/${eventId}/restore`,
    {}
  );
}

}
