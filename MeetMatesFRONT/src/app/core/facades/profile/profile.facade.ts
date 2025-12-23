// Angular
import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { tap, finalize, switchMap } from 'rxjs/operators';

// Core (facades, services, models)
import { BaseFacade } from '../base/base.facade';
import { UserFacade } from '../../facades/user/user.facade';
import { AuthFacade } from '../../facades/auth/auth.facade';
import { EventUserService } from '../../services/event-user/event-user.service';
import { User } from '../../models/user.model';
import { EventResponse } from '../../models/event-response.model';

/** Données complètes du profil utilisateur */
export interface ProfileLoadResult {
  user: User;
  organized: EventResponse[];
  participating: EventResponse[];
}

/**
 * Facade responsable de la gestion du profil utilisateur.
 *
 * Responsabilités :
 * - orchestration des cas d’usage liés au profil utilisateur
 * - chargement des données utilisateur et de ses événements associés
 * - application des règles métier de filtrage des événements
 * - délégation des actions d’authentification et de suppression de compte
 * - exposition d’états réactifs (signals) destinés à l’interface utilisateur
 * - centralisation et exposition des effets transverses
 *   (loading, erreurs, succès) via BaseFacade
 */
@Injectable({ providedIn: 'root' })
export class ProfileFacade extends BaseFacade {
  private userFacade = inject(UserFacade);
  private authFacade = inject(AuthFacade);
  private eventUserService = inject(EventUserService);
  private destroyRef = inject(DestroyRef);

  /** Utilisateur courant */
  readonly user = signal<User | null>(null);

  /** Événements organisés par l'utilisateur */
  readonly eventsOrganized = signal<EventResponse[]>([]);

  /** Événements auxquels l'utilisateur participe */
  readonly eventsParticipating = signal<EventResponse[]>([]);

  /** Charge le profil complet de l'utilisateur. */
  private resetState(): void {
    this.user.set(null);
    this.eventsOrganized.set([]);
    this.eventsParticipating.set([]);
    this.stopLoading();
  }

  /** Charge le profil complet de l'utilisateur. */
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

  /**
  * Charge les événements organisés et participés par l'utilisateur.
  * Les événements organisés sont exclus de la liste des événements participés.
  */
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

  /** Déconnecte l'utilisateur. */
  logout() {
    this.resetState();
    return this.authFacade.logout();
  }

  /** Supprime le compte de l'utilisateur. */
  deleteAccount() {
    return this.userFacade.deleteMyAccount();
  }

}
