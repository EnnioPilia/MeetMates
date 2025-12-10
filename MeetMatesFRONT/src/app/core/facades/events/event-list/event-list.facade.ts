import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, EMPTY, finalize } from 'rxjs';

import { BaseFacade } from '../../base/base.facade';

import { EventService } from '../../../services/event/event.service';
import { ActivityService } from '../../../services/activity/activity.service';
import { EventUserService } from '../../../services/event-user/event-user.service';
import { UserService } from '../../../services/user/user.service';
import { SignalsService } from '../../../services/signals/signals.service';
import { SuccessHandlerService } from '../../../services/success-handler/success-handler.service';
import { NotificationService } from '../../../services/notification/notification.service';

import { EventResponse } from '../../../models/event-response.model';
import { User } from '../../../models/user.model';

/**
 * Facade de gestion de la liste d’événements :
 * - chargement utilisateur / événements
 * - filtrage par activité
 * - mise à jour du titre de page
 * - rejoindre un événement
 * - exposition d’états via signals
 */
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

  /** Liste des événements chargés */
  readonly events = signal<EventResponse[]>([]);

  /** Utilisateur actuellement connecté */
  readonly currentUser = signal<User | null>(null);

  /**
  * Charge l'utilisateur courant.
  * @returns Observable<User | null> observable contenant l'utilisateur chargé ou null
  */
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

  /**
  * Charge tous les événements.
  * Met à jour le signal `events`.
  * @returns Observable<EventResponse[]> observable des événements
  */
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

  /**
  * Charge les événements filtrés par activité.
  * @param activityId ID de l'activité
  * @returns Observable<EventResponse[]> observable des événements filtrés
  */
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

  /**
  * Charge le nom de l'activité et met à jour le titre de la page.
  * @param activityId ID de l'activité
  * @returns Observable<any> observable contenant l'activité chargée
  */
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

  /**
  * Tente de rejoindre un événement avec conditions :
  * - L'utilisateur doit être connecté
  * - L'utilisateur ne doit pas être l'organisateur
  * - L'événement ne doit pas être fermé, complet ou terminé
  * @param eventId ID de l'événement
  * @returns Observable<any> observable de la réponse du service ou EMPTY si non autorisé
  */
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
