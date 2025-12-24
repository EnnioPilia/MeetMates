import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';
import { EventResponse } from '../../models/event-response.model';

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

  /** ADMIN – hard delete utilisateur */
  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/users/${userId}`
    );
  }

  /* ================= EVENTS ================= */

  /** ADMIN – récupérer tous les événements */
  getAllEvents(): Observable<{ message: string; data: EventResponse[] }> {
    return this.http.get<{ message: string; data: EventResponse[] }>(
      `${this.baseUrl}/admin/events`
    );
  }

  /** ADMIN – hard delete événement */
  deleteEvent(eventId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/events/${eventId}`
    );
  }
}
