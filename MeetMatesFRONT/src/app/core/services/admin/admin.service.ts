// Angular
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Varible d'environment
import { environment } from '../../../../environments/environment';

// Core (models)
import { User } from '../../models/user.model';
import { EventResponse } from '../../models/event-response.model';

/**
 * Service responsable des opérations d’administration.
 *
 * Responsabilités :
 * - gérer les utilisateurs (liste, suppression logique/définitive, restauration)
 * - gérer les événements (liste, suppression logique/définitive, restauration)
 *
 * Ce service est réservé aux utilisateurs disposant
 * des droits administrateur.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {

  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;


  /** Récupère la liste complète des utilisateurs. */
  getAllUsers(): Observable<{ message: string; data: User[] }> {
    return this.http.get<{ message: string; data: User[] }>(
      `${this.baseUrl}/admin/users`
    );
  }

  /**
   * Supprime un utilisateur de manière logique (soft delete).
   *
   * @param userId Identifiant de l’utilisateur
   */
  softDeleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/users/${userId}`
    );
  }

  /**
   * Supprime définitivement un utilisateur (hard delete).
   *
   * @param userId Identifiant de l’utilisateur
   */
  hardDeleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/users/${userId}/hard`
    );
  }
  
  /**
   * Restaure un utilisateur précédemment supprimé.
   *
   * @param userId Identifiant de l’utilisateur
   */
  restoreUser(userId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/admin/users/${userId}/restore`,
      {}
    );
  }

  /**
   * Récupère la liste complète des événements.
   */
  getAllEvents(): Observable<{ message: string; data: EventResponse[] }> {
    return this.http.get<{ message: string; data: EventResponse[] }>(
      `${this.baseUrl}/admin/events`
    );
  }

  /**
   * Supprime un événement de manière logique (soft delete).
   *
   * @param eventId Identifiant de l’événement
   */
  softDeleteEvent(eventId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/events/${eventId}`
    );
  }

  /**
   * Supprime définitivement un événement (hard delete).
   *
   * @param eventId Identifiant de l’événement
   */
  hardDeleteEvent(eventId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/admin/events/${eventId}/hard`
    );
  }

  /**
   * Restaure un événement précédemment supprimé.
   *
   * @param eventId Identifiant de l’événement
   */
  restoreEvent(eventId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/admin/events/${eventId}/restore`,
      {}
    );
  }

}
