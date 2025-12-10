import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap, map, finalize } from 'rxjs';
import { takeUntilDestroyed, } from '@angular/core/rxjs-interop';

import { BaseFacade } from '../base/base.facade';

import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';

import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';
import { DestroyRef } from '@angular/core';

/**
* Facade responsable de la gestion des informations utilisateur.
*
* Cette facade gère :
* - le chargement du profil utilisateur
* - la mise à jour des informations et de la photo de profil
* - la suppression du compte
* - la synchronisation avec les signals
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

  /**
  * Charge l'utilisateur courant.
  * @returns Observable<User | null> observable contenant l'utilisateur chargé
  */
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
  * Récupère l'utilisateur courant depuis l'API.
  * @returns Observable<User | null> observable de l'utilisateur
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
  * @param payload Données partielles pour mise à jour
  * @returns Observable<User> observable de l'utilisateur mis à jour
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
  * @param file Fichier image
  * @returns Observable<User> observable de l'utilisateur mis à jour
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

  /**
  * Supprime la photo de profil.
  * @returns Observable<User> observable de l'utilisateur mis à jour
  */
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

  /**
  * Supprime le compte utilisateur et déconnecte l'utilisateur.
  * @returns Observable<any> observable de la réponse de suppression
  */
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
