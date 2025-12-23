import { Injectable } from '@angular/core';

import { EventResponse } from '../models/event-response.model';
import { EventDetails } from '../models/event-details.model';
import { EventListItem } from '../models/event-list-item.model';

/**
 * Service de mapping chargé de transformer les réponses API liées aux événements
 * en modèles internes cohérents utilisés par l'application.
 *
 * Responsabilités :
 * - Normaliser les données provenant de l'API (valeurs nulles, champs optionnels)
 * - Adapter les formats API vers les modèles métier internes
 * - Fournir des valeurs par défaut lorsque certaines données sont absentes
 * 
 * Il constitue une frontière explicite entre le contrat API et le domaine interne.
 */
@Injectable({ providedIn: 'root' })
export class EventMapperService {

  /**
   * Transforme une réponse API d'événement en modèle interne `EventDetails`.
   *
   * Règles de mapping :
   * - les champs manquants sont remplacés par des valeurs par défaut
   * - l'adresse est toujours fournie (objet vide si absente)
   * - les listes de participants sont initialisées à des tableaux vides
   * - le statut de participation est initialisé à `null`
   *
   * @param response Données brutes renvoyées par l'API
   * @returns Modèle `EventDetails` prêt à être consommé par l'application
   */
  toEventDetails(response: EventResponse): EventDetails {
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      eventDate: response.eventDate,
      startTime: response.startTime,
      endTime: response.endTime,
      maxParticipants: response.maxParticipants,
      status: response.status,
      material: response.material,
      level: response.level,
      addressLabel: response.addressLabel,
      address: response.address ?? {
        street: '',
        city: '',
        postalCode: ''
      },
      activityName: response.activityName,
      organizerName: response.organizerName,
      participationStatus: null,
      acceptedParticipants: [],
      pendingParticipants: [],
      rejectedParticipants: [],
      activityId: response.activityId ?? null,
    };
  }

  /**
   * Transforme une liste de réponses API en liste de modèles `EventDetails`.
   *
   * Méthode utilitaire s'appuyant sur `toEventDetails`
   * afin de garantir une normalisation homogène.
   *
   * @param responses Liste brute renvoyée par l'API
   */
  toEventDetailsList(responses: EventResponse[]): EventDetails[] {
    return responses.map(r => this.toEventDetails(r));
  }

  /**
   * Transforme une réponse API d'événement en élément `EventListItem`
   * destiné à l'affichage en liste.
   *
   * Règles de mapping :
   * - les champs alternatifs (`eventTitle`, `eventStatus`, etc.) sont pris en compte
   * - les valeurs absentes sont remplacées par des chaînes vides
   * - l'adresse est formatée en texte lisible
   *
   * @param response Données API d’un événement
   * @returns Élément prêt à être affiché dans une liste
   */
  toEventListItem(response: EventResponse): EventListItem {
    return {
      id: String(response.id),
      eventId: String(response.eventId ?? response.id),
      title: response.eventTitle ?? response.title ?? '',
      date: response.eventDate ?? '',
      status: response.eventStatus ?? response.status ?? '',
      participationStatus: response.participationStatus ?? null,
      activityName: response.activityName ?? '',
      addressLabel: this.formatAddress(response.address),
      imageUrl: response.imageUrl ?? null,
      activityId: String(response.activityId ?? ''),
    };
  }

 /**
   * Formate une adresse issue de l'API en une chaîne lisible.
   *
   * @param addr Objet adresse renvoyé par l'API
   * @returns Adresse formatée pour l'interface utilisateur
   */
  private formatAddress(addr: any): string {
    if (!addr) return '';

    const street = addr.street ?? '';
    const postal = addr.postalCode ?? '';
    const city = addr.city ?? '';

    return `${street}, ${postal} ${city}`.trim();
  }

  /**
   * Transforme une liste de réponses API en liste d’éléments `EventListItem`.
   * 
   * @param responses Liste brute renvoyée par l'API
   */
  toEventList(responses: EventResponse[]): EventListItem[] {
    return responses.map(r => this.toEventListItem(r));
  }
}
