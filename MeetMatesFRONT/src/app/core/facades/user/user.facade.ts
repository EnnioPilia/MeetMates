import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap, map, finalize } from 'rxjs';

import { BaseFacade } from '../base/base.facade';

import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';

import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed, } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class UserFacade extends BaseFacade {
  private destroyRef = inject(DestroyRef);

  private userService = inject(UserService);
  private signals = inject(SignalsService);
  private successHandler = inject(SuccessHandlerService);
  private router = inject(Router);

  readonly user = signal<User | null>(null);

  /** Chargement du user : appelé dans ngOnInit() */
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

  /** Récupération du user depuis API */
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

  /** Mise à jour du profil */
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

  /** Upload photo */
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

  /** Delete photo */
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

  /** Suppression du compte */
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
