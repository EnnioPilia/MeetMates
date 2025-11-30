import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap, map } from 'rxjs';

import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';

import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UserFacade {

  private userService = inject(UserService);
  private signals = inject(SignalsService);
  private successHandler = inject(SuccessHandlerService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  // 🔥 Signals exposés au composant
  readonly user = signal<User | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  /** Chargement du user : appelé dans ngOnInit() */
  loadUser() {
    this.loading.set(true);
    this.error.set(null);

    this.getCurrentUser().subscribe(user => {
      if (!user) {
        this.error.set('Profil introuvable.');
        this.loading.set(false);
        return;
      }

      this.user.set(user);
      this.loading.set(false);
    });
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
      catchError(err => {
        this.errorHandler.handle(err);
        this.error.set('Impossible de récupérer le profil.');
        this.loading.set(false);
        return of(null);
      })
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
      catchError(err => {
        this.errorHandler.handle(err);
        return of(null);
      })
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
      catchError(err => {
        this.errorHandler.handle(err);
        return of(null);
      })
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
      catchError(err => {
        this.errorHandler.handle(err);
        return of(null);
      })
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
      catchError(err => {
        this.errorHandler.handle(err);
        return of(null);
      })
    );
  }
}
