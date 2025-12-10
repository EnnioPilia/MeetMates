import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { EventResponse } from '../../models/event-response.model';
import { EventDetails } from '../../models/event-details.model';
import { EventRequest } from '../../models/event-request.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Service responsable de la communication avec l'API pour la gestion des événements.
 *
 * Rôle :
 * - Récupérer tous les événements
 * - Récupérer les événements par activité
 * - Récupérer le détail d’un événement
 * - Créer, modifier et supprimer un événement
 * - Rechercher des événements
 *
 * Toutes les requêtes utilisent `withCredentials` afin de transmettre les cookies HttpOnly.
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * Récupère tous les événements disponibles.
   * @returns Observable renvoyant la liste des événements
   */
  fetchAllEvents(): Observable<EventResponse[]> {
    return this.http
      .get<ApiResponse<EventResponse[]>>(
        `${this.baseUrl}/event`,
        { withCredentials: true }
      )
      .pipe(map(res => res.data ?? []));
  }

  /**
   * Récupère tous les événements associés à une activité.
   * @param activityId Identifiant de l’activité
   * @returns Observable renvoyant la liste des événements filtrés
   */
  fetchEventsByActivity(activityId: string): Observable<EventResponse[]> {
    return this.http
      .get<ApiResponse<EventResponse[]>>(
        `${this.baseUrl}/event/activity/${activityId}`,
        { withCredentials: true }
      )
      .pipe(map(res => res.data ?? []));
  }
  
  /**
   * Récupère le détail complet d’un événement.
   * @param id Identifiant de l’événement
   * @returns Observable contenant les détails de l’événement
   */
  fetchEventById(id: string): Observable<EventDetails> {
    return this.http
      .get<ApiResponse<EventDetails>>(
        `${this.baseUrl}/event/${id}`,
        { withCredentials: true }
      )
      .pipe(map(res => res.data));
  }

  /**
   * Crée un nouvel événement.
   * @param eventPayload Données du formulaire de création d’événement
   * @returns Observable contenant l’événement créé
   */
  createEvent(eventPayload: EventRequest): Observable<ApiResponse<EventDetails>> {
    return this.http.post<ApiResponse<EventDetails>>(
      `${this.baseUrl}/event`,
      eventPayload,
      { withCredentials: true }
    );
  }

  /**
  * Met à jour un événement existant.
  * @param eventId Identifiant de l’événement
  * @param updatedEvent Données partiellement modifiées
  * @returns Observable contenant l’événement mis à jour
  */
  updateEvent(eventId: string, updatedEvent: Partial<EventDetails>) {
    return this.http.put<ApiResponse<EventDetails>>(
      `${this.baseUrl}/event/${eventId}`,
      updatedEvent,
      { withCredentials: true }
    );
  }

  /**
   * Supprime un événement.
   * @param eventId Identifiant de l’événement à supprimer
   * @returns Observable confirmant la suppression
   */
  deleteEvent(eventId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/event/${eventId}`,
      { withCredentials: true }
    );
  }

  /**
   * Recherche des événements selon une chaîne de recherche.
   * @param query Texte recherché
   * @returns Observable contenant les événements correspondants
   */
  searchEvents(query: string): Observable<EventResponse[]> {
    return this.http
      .get<ApiResponse<EventResponse[]>>(
        `${this.baseUrl}/event/search`,
        { params: { query }, withCredentials: true }
      )
      .pipe(map(res => res.data ?? []));
  }
}
