// Angular
import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

// Core (facades, services, models)
import { BaseFacade } from '../../base/base.facade';
import { EventService } from '../../../services/event/event.service';
import { ActivityService } from '../../../services/activity/activity.service';
import { AddressService } from '../../../services/address/address.service';
import { SuccessHandlerService } from '../../../services/success-handler/success-handler.service';
import { AddressSuggestion } from '../../../services/address/address.service';
import { EventRequest } from '../../../models/event-request.model';
import { EventDetails } from '../../../models/event-details.model';
import { Activity } from '../../../models/activity.model';

/**
 * Facade dédiée à l’édition d’un événement.
 *
 * Responsabilités :
 * - orchestration des cas d’usage liés à l’édition d’un événement
 * - chargement des données nécessaires (événement, activités associées)
 * - délégation des opérations métier aux services dédiés
 * - exposition d’un état réactif (signals) destiné à l’interface utilisateur
 * - centralisation et exposition des effets transverses
 *   (loading, erreurs, succès) via BaseFacade
 */
@Injectable({ providedIn: 'root' })
export class EditEventFacade extends BaseFacade {
    private eventService = inject(EventService);
    private activityService = inject(ActivityService);
    private addressService = inject(AddressService);
    private successHandler = inject(SuccessHandlerService);
    private destroyRef = inject(DestroyRef);

    /** Liste des activités disponibles pour l'édition */
    readonly activities = signal<Activity[]>([]);

    /** Détails complets de l'événement en cours d'édition */
    readonly event = signal<EventDetails | null>(null);

    /** Suggestions d'adresses pour l'auto-complétion */
    readonly addressSuggestions = signal<AddressSuggestion[]>([]);

    /**
    * Charge les données nécessaires à l'édition d'un événement :
    * - toutes les activités
    * - les détails de l'événement
    * 
    * @param eventId ID de l'événement à charger
    */
    loadEvent(eventId: string) {
        this.startLoading();

        return forkJoin([
            this.activityService.fetchAllActivities(),
            this.eventService.fetchEventById(eventId)
        ]).pipe(
            tap(([activities, event]) => {

                const activity = activities.find(
                    a => a.name === event.activityName
                );

                this.activities.set(activities);

                this.event.set({
                    ...event,
                    activityId: activity?.id ?? null
                });

                this.stopLoading();
            }),
            this.handleError("Erreur lors du chargement.")
        );
    }


    /**
    * Met à jour un événement et déclenche la notification de succès.
    * 
    * @param eventId ID de l'événement à mettre à jour
    * @param payload Données complètes de l'événement pour la mise à jour
    */
    updateEvent(eventId: string, payload: EventRequest) {
    this.startLoading();

    return this.eventService.updateEvent(eventId, payload).pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(res => {
        this.successHandler.handle(res);

        if (res.data) {
            this.event.set(res.data); 
        }

        this.stopLoading();
        }),
        this.handleError()
    );
    }

    /**
    * Récupère des suggestions d'adresse pour l'auto-complétion.
    * 
    * @param query Texte de recherche
    */
    getAddressSuggestions(query: string) {
        return this.addressService.getAddressSuggestions(query).pipe(
            takeUntilDestroyed(this.destroyRef),
            tap(suggestions => this.addressSuggestions.set(suggestions)),
            this.handleError()
        );
    }
}
