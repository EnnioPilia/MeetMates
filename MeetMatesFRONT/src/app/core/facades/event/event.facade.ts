import { Injectable, inject, signal } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';

import { BaseFacade } from '../base/base.facade'; 

import { ActivityService } from '../../services/activity/activity.service';
import { EventService } from '../../services/event/event.service';
import { EventUserService } from '../../services/event-user/event-user.service';
import { AddressService } from '../../services/address/address.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';

import { Activity } from '../../models/activity.model';
import { AddressSuggestion } from '../../services/address/address.service';

@Injectable({ providedIn: 'root' })
export class EventFacade extends BaseFacade{

    private activityService = inject(ActivityService);
    private eventService = inject(EventService);
    private addressService = inject(AddressService);
    private successHandler = inject(SuccessHandlerService);
    private errorHandler = inject(ErrorHandlerService);
    private eventUserService = inject(EventUserService);

    readonly activities = signal<Activity[]>([]);
    readonly addressSuggestions = signal<AddressSuggestion[]>([]);
    readonly event = signal<any | null>(null);

    isSubmitting = false;

    // Charger toutes les activités
    loadActivities() {
        this.startLoading()

        this.activityService.fetchAllActivities().subscribe({
            next: (data) => {
                this.activities.set(data);
                this.stopLoading();
            },
            error: (err) => {
                this.errorHandler.handle(err);
                this.setError("Impossible de charger les activités.");
                this.stopLoading();
            }
        });
    }

    // Suggestions d'adresses
    searchAddress(query: string) {
        this.addressService.getAddressSuggestions(query).subscribe({
            next: (suggestions) => this.addressSuggestions.set(suggestions),
            error: (err) => {
                this.errorHandler.handle(err);
            }
        });
    }

    // Créer un événement
    createEvent(payload: any) {
        this.startLoading()

        return this.eventService.createEvent(payload).pipe(
            tap(res => {
                this.successHandler.handle(res);
                this.stopLoading();
            }),
            catchError(err => {
                this.errorHandler.handle(err);
                this.stopLoading();
                return EMPTY;
            })
        );
    }

    acceptParticipant(eventUserId: string) {
        return this.eventUserService.acceptParticipant(eventUserId).pipe(
            tap(res => {
                this.successHandler.handle(res);
            }),
            catchError(err => {
                this.errorHandler.handle(err);
                return EMPTY;
            })
        );
    }

    rejectParticipant(eventUserId: string) {
        return this.eventUserService.rejectParticipant(eventUserId).pipe(
            tap(res => {
                this.successHandler.handle(res);
            }),
            catchError(err => {
                this.errorHandler.handle(err);
                return EMPTY;
            })
        );
    }

    deleteEvent(eventId: string) {
        return this.eventService.deleteEvent(eventId).pipe(
            tap(res => {
                this.successHandler.handle(res);
            }),
            catchError(err => {
                this.errorHandler.handle(err);
                return EMPTY;
            })
        );
    }

    load(eventId: string) {
        this.startLoading()

        return this.eventService.fetchEventById(eventId).pipe(
            tap(event => {
                (this as any).event?.set(event)
                this.stopLoading();
            }),
            catchError(err => {
                this.errorHandler.handle(err);
                this.setError('Impossible de charger les événements');
                this.stopLoading();
                return EMPTY;
            })
        );
    }

    leave(eventId: string) {
        return this.eventUserService.leaveEvent(eventId).pipe(
            tap(res => {
                this.successHandler.handle(res);
            }),
            catchError(err => {
                this.errorHandler.handle(err);
                return EMPTY;
            })
        );
    }

}
