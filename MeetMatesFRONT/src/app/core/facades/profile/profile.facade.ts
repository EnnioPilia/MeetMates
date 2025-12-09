import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { tap, finalize, switchMap } from 'rxjs/operators';

import { UserFacade } from '../../facades/user/user.facade';
import { AuthFacade } from '../../facades/auth/auth.facade';
import { EventUserService } from '../../services/event-user/event-user.service';

import { User } from '../../models/user.model';
import { EventResponse } from '../../models/event-response.model';
import { BaseFacade } from '../base/base.facade';

export interface ProfileLoadResult {
  user: User;
  organized: EventResponse[];
  participating: EventResponse[];
}

@Injectable({ providedIn: 'root' })
export class ProfileFacade extends BaseFacade {

  private userFacade = inject(UserFacade);
  private authFacade = inject(AuthFacade);
  private eventUserService = inject(EventUserService);
  private destroyRef = inject(DestroyRef);

  readonly user = signal<User | null>(null);
  readonly eventsOrganized = signal<EventResponse[]>([]);
  readonly eventsParticipating = signal<EventResponse[]>([]);

  private resetState(): void {
    this.user.set(null);
    this.eventsOrganized.set([]);
    this.eventsParticipating.set([]);
    this.stopLoading();
  }

  /** Chargement du profil */
  loadProfile() {
    this.resetState();
    this.startLoading();

    return this.userFacade.getCurrentUser().pipe(
      takeUntilDestroyed(this.destroyRef),
      this.handleError('Impossible de charger le profil.'),
      tap(user => {
        if (!user) {
          this.setError('Profil introuvable.');
          return;
        }
        this.user.set(user);
      }),
      switchMap(() => this.loadUserEvents()),
      finalize(() => this.stopLoading())
    );
  }

  /** Charge événements */
  private loadUserEvents() {
    return forkJoin({
      organized: this.eventUserService.getOrganizedEvents(),
      participating: this.eventUserService.getParticipatingEvents()
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      this.handleError(),
      tap(({ organized, participating }) => {
        const orgIds = new Set(organized.map(e => e.eventId ?? e.id));
        const filtered = participating.filter(e => !orgIds.has(e.eventId ?? e.id));

        this.eventsOrganized.set(organized);
        this.eventsParticipating.set(filtered);
      })
    );
  }

  /** Déconnexion */
  logout() {
    this.resetState();
    return this.authFacade.logout();
  }

  /** Suppression du compte */
  deleteAccount() {
    return this.userFacade.deleteMyAccount();
  }


}
