import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap, map } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private userService = inject(UserService);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

getCurrentUser() {
  return this.userService.getCurrentUser().pipe(
    map((res: ApiResponse<User>) => res.data), // <- ici on retourne le User directement
    tap(user => {
      this.signals.updateCurrentUser(user);
    }),
    catchError(err => {
      this.errorHandler.handle(err);
      return of(null);
    })
  );
}


  /** Mise à jour du profil */
  updateMyProfile(payload: Partial<User>) {
    return this.userService.updateMyProfile(payload).pipe(
      tap((res: ApiResponse<User>) => {
        this.signals.updateCurrentUser(res.data);
        this.notification.showSuccess(res.message); // <-- message du backend
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
      tap((res: ApiResponse<User>) => {
        this.signals.updateCurrentUser(res.data);
        this.notification.showSuccess(res.message); // <-- message du backend
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
      tap((res: ApiResponse<User>) => {
        this.signals.updateCurrentUser(res.data);
        this.notification.showSuccess(res.message); // <-- message du backend
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
      tap((res: ApiResponse<void>) => {
        this.notification.showSuccess(res.message); // <-- message du backend
        this.signals.clearCurrentUser();
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        this.errorHandler.handle(err);
        return of(null);
      })
    );
  }
}
