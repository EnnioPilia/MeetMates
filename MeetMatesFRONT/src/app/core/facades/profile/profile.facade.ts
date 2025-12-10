import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { tap, finalize, switchMap } from 'rxjs/operators';

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
 * Facade responsable de la gestion du profil utilisateur :
 * - chargement du profil
 * - récupération des événements organisés et participés
 * - filtrage des événements dupliqués
 * - déconnexion
 * - suppression du compte
 * - exposition d’états via signals
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

  /**
  * Charge le profil complet de l'utilisateur.
  * @returns Observable<ProfileLoadResult> observable contenant les informations du profil et les événements
  */
  private resetState(): void {
    this.user.set(null);
    this.eventsOrganized.set([]);
    this.eventsParticipating.set([]);
    this.stopLoading();
  }

  /**
  * Charge le profil complet de l'utilisateur.
  * @returns Observable<ProfileLoadResult> observable contenant les informations du profil et les événements
  */
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
  * @returns Observable<ProfileLoadResult> observable contenant les événements filtrés
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

  /**
  * Déconnecte l'utilisateur.
  * @returns Observable<any> observable de la réponse de déconnexion
  */
  logout() {
    this.resetState();
    return this.authFacade.logout();
  }

  /**
  * Supprime le compte de l'utilisateur.
  * @returns Observable<any> observable de la réponse de suppression
  */
  deleteAccount() {
    return this.userFacade.deleteMyAccount();
  }

}
