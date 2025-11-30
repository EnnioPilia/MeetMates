import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { catchError, EMPTY, tap, Observable, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model'; 

import { EventService } from '../../services/event/event.service';
import { ActivityService } from '../../services/activity/activity.service';
import { EventUserService } from '../../services/event-user/event-user.service';
import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';

import { EventResponse } from '../../models/event-response.model';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class EventListFacade {

  private eventService = inject(EventService);
  private eventUserService = inject(EventUserService);
  private activityService = inject(ActivityService);
  private userService = inject(UserService);

  private signals = inject(SignalsService);
  private errorHandler = inject(ErrorHandlerService);
  private successHandler = inject(SuccessHandlerService);
  private notification = inject(NotificationService);

  private destroyRef = inject(DestroyRef);

  readonly events = signal<EventResponse[]>([]);
  readonly currentUser = signal<User | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadCurrentUser();
  }

  /** Charger user courant */
  private loadCurrentUser() {
    this.userService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          const user = res?.data ?? null;
          this.currentUser.set(user);
          if (user) this.signals.updateCurrentUser(user);
        },
        error: err => this.errorHandler.handle(err)
      });
  }

  /** Charger tous les événements */
  loadAllEvents() {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.fetchAllEvents()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err);
          this.error.set("Impossible de charger les événements.");
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe(events => {
        this.events.set(events);
        this.loading.set(false);
      });
  }

  /** Charger événements par activité */
  loadEventsByActivity(activityId: string) {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.fetchEventsByActivity(activityId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err);
          this.error.set("Impossible de charger les événements.");
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe(events => {
        this.events.set(events);
        this.loading.set(false);
      });
  }

  /** Charger nom activité */
  loadActivityName(activityId: string) {
    this.activityService.fetchActivityById(activityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: activity => this.signals.setPageTitle(activity.name),
        error: err => {
          this.errorHandler.handle(err);
          this.signals.setPageTitle("Activité inconnue");
        }
      });
  }


  joinEvent(eventId: string): Observable<ApiResponse<void>> {
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
