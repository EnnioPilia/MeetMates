import { Injectable, inject, signal } from '@angular/core';
import { tap, finalize } from 'rxjs';
import { BaseFacade } from '../base/base.facade';
import { EventRequest } from '../../models/event-request.model';

import { ActivityService } from '../../services/activity/activity.service';
import { EventService } from '../../services/event/event.service';
import { EventUserService } from '../../services/event-user/event-user.service';
import { AddressService } from '../../services/address/address.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';
import { EventDetails } from '../../models/event-details.model';

import { Activity } from '../../models/activity.model';
import { AddressSuggestion } from '../../services/address/address.service';

@Injectable({ providedIn: 'root' })
export class EventFacade extends BaseFacade {
    private activityService = inject(ActivityService);
    private eventService = inject(EventService);
    private addressService = inject(AddressService);
    private eventUserService = inject(EventUserService);
    private successHandler = inject(SuccessHandlerService);

    readonly activities = signal<Activity[]>([]);
    readonly addressSuggestions = signal<AddressSuggestion[]>([]);
    readonly event = signal<EventDetails | null>(null);

    isSubmitting = false;
    
    private start() { this.isSubmitting = true; }
    private stop() { this.isSubmitting = false; }

    /** Charger toutes les activités */
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


    /** Suggestions d'adresses */
    searchAddress(query: string) {
        return this.addressService.getAddressSuggestions(query).pipe(
            this.handleError(),
            tap(suggestions => {
                if (!suggestions) return;
                this.addressSuggestions.set(suggestions);
            })
        );
    }


    /** Créer un événement */
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

    /** Accepter participant */
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

    /** Refuser participant */
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

    /** Supprimer un événement */
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

    /** Charger un événement */
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

    /** Quitter un événement */
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
}
