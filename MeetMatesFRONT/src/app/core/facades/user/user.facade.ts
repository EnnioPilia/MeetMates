import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap, map, finalize } from 'rxjs';
import { takeUntilDestroyed, } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import { BaseFacade } from '../base/base.facade';

import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';

import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Facade responsable de la gestion du domaine utilisateur.
 *
 * Responsabilités :
 * - orchestration des cas d’usage liés au profil utilisateur
 * - chargement et mise à jour des informations utilisateur
 * - synchronisation de l’état utilisateur entre l’API, les signals globaux
 *   et l’état local de la facade
 * - délégation des opérations métier au UserService
 * - exposition d’états réactifs (signals) destinés à l’interface utilisateur
 * - centralisation et exposition des effets transverses
 *   (loading, erreurs, succès) via BaseFacade
 */

@Injectable({ providedIn: 'root' })
export class UserFacade extends BaseFacade {
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private signals = inject(SignalsService);
  private successHandler = inject(SuccessHandlerService);
  private router = inject(Router);

  /** Signal contenant l'utilisateur courant */
  readonly user = signal<User | null>(null);

  /** Charge l'utilisateur courant. */
  loadUser() {
    this.startLoading();

    return this.getCurrentUser().pipe(
      takeUntilDestroyed(this.destroyRef),
      this.handleError('Impossible de récupérer le profil.'),
      tap(user => {
        if (!user) {
          this.setError('Profil introuvable.');
          return;
        }

        this.user.set(user);
      }),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * Récupère l'utilisateur courant depuis l'API et synchronise
   * l’état utilisateur local et global (signals).
   */
  getCurrentUser() {
    return this.userService.getCurrentUser().pipe(
      map((res: ApiResponse<User>) => res.data),
      tap(user => {
        if (user) {
          this.signals.updateCurrentUser(user);
          this.user.set(user);
        }
      }),
      this.handleError('Impossible de récupérer le profil.')
    );
  }

  /**
  * Met à jour le profil utilisateur.
  * 
  * @param payload Données partielles pour mise à jour
  */
  updateMyProfile(payload: Partial<User>) {
    return this.userService.updateMyProfile(payload).pipe(
      tap(res => {
        this.signals.updateCurrentUser(res.data);
        this.user.set(res.data);
        this.successHandler.handle(res);
        this.router.navigate(['/profile']);
      }),
      this.handleError()
    );
  }

  /**
  * Upload de la photo de profil.
  * 
  * @param file Fichier image
  */
  uploadProfilePicture(file: File) {
    return this.userService.uploadProfilePicture(file).pipe(
      tap(res => {
        this.signals.updateCurrentUser(res.data);
        this.user.set(res.data);
        this.successHandler.handle(res);
      }),
      this.handleError()
    );
  }

  /** Supprime la photo de profil. */
  deleteProfilePicture() {
    return this.userService.deleteProfilePicture().pipe(
      tap(res => {
        this.signals.updateCurrentUser(res.data);
        this.user.set(res.data);
        this.successHandler.handle(res);
      }),
      this.handleError()
    );
  }

  /** Supprime le compte utilisateur et déconnecte l'utilisateur. */
  deleteMyAccount() {
    return this.userService.deleteMyAccount().pipe(
      tap(res => {
        this.successHandler.handle(res);
        this.signals.clearCurrentUser();
        this.user.set(null);
        this.router.navigate(['/login']);
      }),
      this.handleError()
    );
  }
}
