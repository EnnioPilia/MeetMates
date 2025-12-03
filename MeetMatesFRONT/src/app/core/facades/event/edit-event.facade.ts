import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { ActivityService } from '../../services/activity/activity.service';
import { AddressService } from '../../services/address/address.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EventDetails } from '../../models/event-details.model';
import { Activity } from '../../models/activity.model';
import { AddressSuggestion } from '../../services/address/address.service';
import { BaseFacade } from '../base/base.facade';

@Injectable({ providedIn: 'root' })
export class EditEventFacade extends BaseFacade {

  private eventService = inject(EventService);
  private activityService = inject(ActivityService);
  private addressService = inject(AddressService);
  private successHandler = inject(SuccessHandlerService);
  private destroyRef = inject(DestroyRef);

  readonly activities = signal<Activity[]>([]);
  readonly event = signal<EventDetails | null>(null);
  readonly addressSuggestions = signal<AddressSuggestion[]>([]);

  /** Charger activité + événement */
loadEvent(eventId: string) {
  this.startLoading();

  return forkJoin([
    this.activityService.fetchAllActivities(),
    this.eventService.fetchEventById(eventId)
  ]).pipe(
    tap(([activities, event]) => {
      this.activities.set(activities);
      this.event.set(event);
      this.stopLoading();
    }),
    this.handleError("Erreur lors du chargement.")
  );
}


  /** Mettre à jour un événement */
  updateEvent(eventId: string, payload: EventDetails) {
    this.startLoading();

    return this.eventService.updateEvent(eventId, payload).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(res => {
        this.successHandler.handle(res);
        this.stopLoading();
      }),
      this.handleError()
    );
  }

  /** Suggestions d’adresse */
  getAddressSuggestions(query: string) {
    return this.addressService.getAddressSuggestions(query).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(suggestions => this.addressSuggestions.set(suggestions)),
      this.handleError()
    );
  }
}
