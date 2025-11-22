import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, of, tap } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private userService = inject(UserService);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);











// MESSAGE DU BACK EN DTO !!!!!!!




  /** Charger l'utilisateur connecté */
  getCurrentUser() {
    return this.userService.getCurrentUser().pipe(
      tap((user: User) => {
        this.signals.updateCurrentUser(user);
      }),
      catchError(err => {
        this.errorHandler.handle(err, '❌ Erreur lors du chargement du profil.');
        return of(null);
      })
    );
  }

  /** Mise à jour du profil */
  updateMyProfile(payload: Partial<User>) {
    return this.userService.updateMyProfile(payload).pipe(
      tap((user: User) => {
        this.signals.updateCurrentUser(user);
        this.notification.showSuccess('✅ Profil mis à jour avec succès !');
        this.router.navigate(['/profile']);
      }),
      catchError(err => {
        this.errorHandler.handle(err, '❌ Erreur lors de la mise à jour du profil.');
        return of(null);
      })
    );
  }

  /** Upload photo */
  uploadProfilePicture(file: File) {
    return this.userService.uploadProfilePicture(file).pipe(
      tap((user: User) => {
        this.signals.updateCurrentUser(user);
        this.notification.showSuccess('✅ Photo mise à jour avec succès !');
      }),
      catchError(err => {
        this.errorHandler.handle(err, '❌ Erreur lors du téléversement de la photo.');
        return of(null);
      })
    );
  }

/** Delete photo */
deleteProfilePicture() {
  return this.userService.deleteProfilePicture().pipe(
    tap(() => {
      const user = this.signals.currentUser();
      if (!user) return;

      this.signals.updateCurrentUser({
        ...user,
        profilePictureUrl: null
      });
    }),
    catchError(err => {
      this.errorHandler.handle(err, '❌ Erreur lors de la suppression de la photo.');
      return of(null);
    })
  );
}


  /** Suppression du compte */
  deleteMyAccount() {
    return this.userService.deleteMyAccount().pipe(
      tap((res: { message: string }) => {
        this.notification.showSuccess(res.message);
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
