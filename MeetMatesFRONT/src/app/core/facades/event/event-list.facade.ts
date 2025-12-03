import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, EMPTY, finalize } from 'rxjs';

import { BaseFacade } from '../base/base.facade';

import { EventService } from '../../services/event/event.service';
import { ActivityService } from '../../services/activity/activity.service';
import { EventUserService } from '../../services/event-user/event-user.service';
import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';

import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

import { EventResponse } from '../../models/event-response.model';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class EventListFacade extends BaseFacade {

  private eventService = inject(EventService);
  private eventUserService = inject(EventUserService);
  private activityService = inject(ActivityService);
  private userService = inject(UserService);

  private signals = inject(SignalsService);
  private successHandler = inject(SuccessHandlerService);
  private notification = inject(NotificationService);

  private destroyRef = inject(DestroyRef);

  readonly events = signal<EventResponse[]>([]);
  readonly currentUser = signal<User | null>(null);

  /** Charger utilisateur courant */
  loadCurrentUser() {
    return this.userService.getCurrentUser().pipe(
      takeUntilDestroyed(this.destroyRef),
      this.handleError("Impossible de charger l'utilisateur."),
      tap(res => {
        const user = res?.data ?? null;
        this.currentUser.set(user);
        if (user) this.signals.updateCurrentUser(user);
      })
    );
  }


  /** Charger tous les événements */
  loadAllEvents() {
    this.startLoading();

    return this.eventService.fetchAllEvents().pipe(
      takeUntilDestroyed(this.destroyRef),
      this.handleError("Impossible de charger les événements."),
      tap(events => {
        if (!events) return;
        this.events.set(events);
      }),
      finalize(() => this.stopLoading())
    );
  }

  /** Charger événements par activité */
  loadEventsByActivity(activityId: string) {
    this.startLoading();

    return this.eventService.fetchEventsByActivity(activityId).pipe(
      takeUntilDestroyed(this.destroyRef),
      this.handleError("Impossible de charger les événements."),
      tap(events => {
        if (!events) return;
        this.events.set(events);
      }),
      finalize(() => this.stopLoading())
    );
  }

  /** Charger nom activité */
  loadActivityName(activityId: string) {
    return this.activityService.fetchActivityById(activityId).pipe(
      takeUntilDestroyed(this.destroyRef),
      this.handleError(),
      tap(activity => {
        if (!activity) {
          this.signals.setPageTitle("Activité inconnue");
          return;
        }
        this.signals.setPageTitle(activity.name);
      })
    );
  }


  /** Rejoindre un événement */
  joinEvent(eventId: string) {
    const user = this.signals.currentUser();

    if (!user) {
      this.notification.showError('Vous devez être connecté pour participer à un événement.');
      return EMPTY;
    }

    const eventFound = this.events().find(e => e.id === eventId);
    if (!eventFound) return EMPTY;

    if (eventFound.organizerId === user.id) {
      this.notification.showWarning('Vous êtes l’organisateur de cet événement.');
      return EMPTY;
    }

    if (['CANCELLED', 'FULL', 'FINISHED'].includes(eventFound.status?.toUpperCase() || '')) {
      this.notification.showError('Cet événement n’est plus disponible.');
      return EMPTY;
    }

    return this.eventUserService.joinEvent(eventId).pipe(
      tap(res => this.successHandler.handle(res)),
      this.handleError()
    );
  }
}
