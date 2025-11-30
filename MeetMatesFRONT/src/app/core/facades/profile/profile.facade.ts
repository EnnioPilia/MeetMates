import { Injectable, inject, signal } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UserFacade } from '../../facades/user/user.facade';
import { AuthFacade } from '../../facades/auth/auth.facade';
import { EventUserService } from '../../services/event-user/event-user.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';

import { User } from '../../models/user.model';
import { EventResponse } from '../../models/event-response.model';

@Injectable({ providedIn: 'root' })
export class ProfileFacade {

  private userFacade = inject(UserFacade);
  private authFacade = inject(AuthFacade);
  private eventUserService = inject(EventUserService);
  private errorHandler = inject(ErrorHandlerService);
  private destroyRef = inject(DestroyRef);

  readonly user = signal<User | null>(null);
  readonly eventsOrganized = signal<EventResponse[]>([]);
  readonly eventsParticipating = signal<EventResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  loadProfile() {
    this.loading.set(true);
    this.error.set(null);

    this.userFacade.getCurrentUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err);
          this.error.set('Impossible de charger le profil.');
          return EMPTY;
        })
      )
      .subscribe(user => {
        if (!user) {
          this.error.set('Profil introuvable.');
          this.loading.set(false);
          return;
        }

        this.user.set(user);
        this.loadUserEvents();
      });
  }

  /** Charge événements */
  private loadUserEvents() {
    forkJoin({
      organized: this.eventUserService.getOrganizedEvents(),
      participating: this.eventUserService.getParticipatingEvents()
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe(({ organized, participating }) => {
        const orgIds = new Set(organized.map(e => e.eventId ?? e.id));
        const filtered = participating.filter(e => !orgIds.has(e.eventId ?? e.id));

        this.eventsOrganized.set(organized);
        this.eventsParticipating.set(filtered);
      });
  }

  /** Déconnexion */
  logout() {
    return this.authFacade.logout(); 
  }

  /** Suppression du compte */
  deleteAccount() {
    return this.userFacade.deleteMyAccount(); 
  }
}
