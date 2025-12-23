// Angular
import { Injectable, inject, signal } from '@angular/core';
import { tap, finalize } from 'rxjs';

// Core (facades, services, models)
import { BaseFacade } from '../../base/base.facade';
import { ActivityService } from '../../../services/activity/activity.service';
import { EventService } from '../../../services/event/event.service';
import { EventUserService } from '../../../services/event-user/event-user.service';
import { AddressService } from '../../../services/address/address.service';
import { SuccessHandlerService } from '../../../services/success-handler/success-handler.service';
import { AddressSuggestion } from '../../../services/address/address.service';
import { EventDetails } from '../../../models/event-details.model';
import { Activity } from '../../../models/activity.model';
import { EventRequest } from '../../../models/event-request.model';

/**
 * Facade responsable de la gestion d’un événement.
 *
 * Responsabilités :
 * - orchestration des cas d’usage liés aux événements
 * - délégation aux services métier
 * - exposition d’états réactifs (signals)
 * - centralisation et exposition des effets transverses
 *   (loading, erreurs, succès) via BaseFacade
 */
@Injectable({ providedIn: 'root' })
export class EventFacade extends BaseFacade {
    private activityService = inject(ActivityService);
    private eventService = inject(EventService);
    private addressService = inject(AddressService);
    private eventUserService = inject(EventUserService);
    private successHandler = inject(SuccessHandlerService);

    /** Liste des activités disponibles */
    readonly activities = signal<Activity[]>([]);

    /** Suggestions pour l'auto-complétion d'adresse */
    readonly addressSuggestions = signal<AddressSuggestion[]>([]);

    /** Détails complets de l'événement chargé */
    readonly event = signal<EventDetails | null>(null);

    /** Indique si un formulaire d'authentification est en cours de soumission */
    isSubmitting = false;
    private start() { this.isSubmitting = true; }
    private stop() { this.isSubmitting = false; }

    /** Charge toutes les activités disponibles. */
    loadActivities() {
        this.startLoading();

        return this.activityService.fetchAllActivities().pipe(
            this.handleError("Impossible de charger les activités."),
            tap(data => {
                if (!data) return;
                this.activities.set(data);
            }),
            finalize(() => this.stopLoading())
        );
    }

    /**
    * Crée un événement.
    * 
    * @param payload Données de création de l'événement
    */
    createEvent(payload: EventRequest) {
        this.start();
        this.startLoading();

        return this.eventService.createEvent(payload).pipe(
            tap(res => {
                this.successHandler.handle(res);
                this.stop();
                this.stopLoading();
            }),
            this.handleError()
        );
    }

    /**
    * Accepte un participant à un événement.
    * 
    * @param eventUserId ID du participant
    */
    acceptParticipant(eventUserId: string) {
        this.start();

        return this.eventUserService.acceptParticipant(eventUserId).pipe(
            tap(res => {
                this.successHandler.handle(res);
                this.stop();
            }),
            this.handleError()
        );
    }

    /**
    * Refuse un participant à un événement.
    * 
    * @param eventUserId ID du participant
    */
    rejectParticipant(eventUserId: string) {
        this.start();

        return this.eventUserService.rejectParticipant(eventUserId).pipe(
            tap(res => {
                this.successHandler.handle(res);
                this.stop();
            }),
            this.handleError()
        );
    }

    /**
    * Supprime un événement.
    * 
    * @param eventId ID de l'événement à supprimer
    */
    deleteEvent(eventId: string) {
        this.start();

        return this.eventService.deleteEvent(eventId).pipe(
            tap(res => {
                this.successHandler.handle(res);
                this.stop();
            }),
            this.handleError()
        );
    }

    /**
    * Charge un événement existant.
    * 
    * @param eventId ID de l'événement à charger
    */
    load(eventId: string) {
        this.startLoading();

        return this.eventService.fetchEventById(eventId).pipe(
            tap(event => {
                this.event.set(event);
                this.stopLoading();
            }),
            this.handleError("Impossible de charger l'événements")
        );
    }

    /**
    * Quitte un événement.
    * 
    * @param eventId ID de l'événement à quitter
    */
    leave(eventId: string) {
        this.start();

        return this.eventUserService.leaveEvent(eventId).pipe(
            tap(res => {
                this.successHandler.handle(res);
                this.stop();
            }),
            this.handleError()
        );
    }
    
    /**
    * Recherche des suggestions d'adresses.
    * 
    * @param query Texte de recherche pour les suggestions d'adresse
    */
    searchAddress(query: string) {
        return this.addressService.getAddressSuggestions(query).pipe(
            this.handleError(),
            tap(suggestions => {
                if (!suggestions) return;
                this.addressSuggestions.set(suggestions);
            })
        );
    }

}
