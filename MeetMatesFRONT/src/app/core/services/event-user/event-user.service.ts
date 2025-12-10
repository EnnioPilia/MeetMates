import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { EventResponse } from '../../models/event-response.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Service responsable de la gestion des interactions entre les utilisateurs
 * et les événements : participation, acceptation, refus, retrait, etc.
 *
 * Rôle :
 * - Rejoindre un événement
 * - Accepter ou rejeter un participant
 * - Retirer un participant d’un événement
 * - Quitter un événement
 * - Récupérer les événements organisés ou ceux auxquels l’utilisateur participe
 *
 * Toutes les requêtes transmettent automatiquement les cookies HttpOnly via `withCredentials`.
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
   * @returns Observable confirmant l'inscription
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
   * @returns Observable confirmant l'action
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
   * @returns Observable confirmant le rejet
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
   * @returns Observable confirmant la suppression
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
   * @returns Observable confirmant le retrait
   */
  leaveEvent(eventId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/event-user/${eventId}/leave`,
      { withCredentials: true }
    );
  }

  /**
   * Récupère les événements organisés par l’utilisateur connecté.
   * @returns Observable renvoyant la liste des événements organisés
   */
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
