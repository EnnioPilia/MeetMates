// Angular
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Varible d'environment
import { environment } from '../../../../environments/environment';

// Core (models)
import { EventResponse } from '../../models/event-response.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Service responsable de la gestion des interactions entre les utilisateurs
 * et les événements : participation, acceptation, refus, retrait, etc.
 *
 * Responsabilités :
 * - Rejoindre un événement
 * - Accepter ou rejeter un participant
 * - Retirer un participant d’un événement
 * - Quitter un événement
 * - Récupérer les événements organisés ou ceux auxquels l’utilisateur participe
 * 
 * Requêtes authentifiées via cookies HttpOnly (requêtes avec `withCredentials`)
 */
@Injectable({
  providedIn: 'root'
})
export class EventUserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * Permet à l'utilisateur connecté de rejoindre un événement.
   * @param eventId Identifiant de l’événement
   */
  joinEvent(eventId: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/event-user/${eventId}/join`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Accepte la demande de participation d’un utilisateur à un événement.
   * @param eventUserId Identifiant de la relation EventUser
   */
  acceptParticipant(eventUserId: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/event-user/${eventUserId}/accept`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Rejette la demande de participation d’un utilisateur.
   * @param eventUserId Identifiant de la relation EventUser
   */
  rejectParticipant(eventUserId: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/event-user/${eventUserId}/reject`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Retire un participant d’un événement.
   * @param eventId Identifiant de l’événement
   * @param userId Identifiant de l’utilisateur à retirer
   */
  removeParticipant(eventId: string, userId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/event-user/${eventId}/participants/${userId}`,
      { withCredentials: true }
    );
  }

  /**
   * Permet à l’utilisateur de quitter un événement auquel il participe.
   * @param eventId Identifiant de l’événement
   */
  leaveEvent(eventId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/event-user/${eventId}/leave`,
      { withCredentials: true }
    );
  }

  /** Récupère les événements organisés par l’utilisateur connecté. */
  getOrganizedEvents(): Observable<EventResponse[]> {
    return this.http.get<ApiResponse<EventResponse[]>>(
      `${this.baseUrl}/event-user/organized`,
      { withCredentials: true }
    ).pipe(
      map(res => res.data ?? [])
    );
  }

  /**
   * Récupère les événements auxquels l’utilisateur participe.
   * @returns Observable renvoyant la liste des participations
   */
  getParticipatingEvents(): Observable<EventResponse[]> {
    return this.http.get<ApiResponse<EventResponse[]>>(
      `${this.baseUrl}/event-user/participating`,
      { withCredentials: true }
    ).pipe(
      map(res => res.data ?? [])
    );
  }
}
