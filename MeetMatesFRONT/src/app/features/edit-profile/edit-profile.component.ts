import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserService } from '../../core/services/user/user.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { SignalsService } from '../../core/services/signals/signals.service';
import { ErrorHandlerService } from '../../core/services/error-handler/error-handler.service';
import { User } from '../../core/models/user.model';
import { EditProfilePictureComponent } from './components/edit-profile-picture.component';
import { EditProfileFormComponent } from './components/edit-profile-form.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    EditProfilePictureComponent,
    EditProfileFormComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  private userService = inject(UserService);
  private notification = inject(NotificationService);
  private signals = inject(SignalsService);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly error = signal<string | null>(null);
  readonly loading = signal<boolean>(true);
  user!: User;

  ngOnInit() {
    this.userService.getCurrentUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Erreur lors du chargement du profil.');
          this.error.set('Profil introuvable.');
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe(user => {
        this.user = user;
        this.signals.updateCurrentUser(user);
        this.loading.set(false);
      });
  }

  onSave(formValue: Partial<User>) {
    this.userService.updateMyProfile({ ...this.user, ...formValue })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Erreur lors de la mise à jour du profil.');
          return EMPTY;
        })
      )
      .subscribe(user => {
        this.user = user;
        this.signals.updateCurrentUser(user);
        this.notification.showSuccess('✅ Profil enregistré avec succès !');
        this.router.navigate(['/profile']);
      });
  }

  onPhotoSelected(file: File) {
    this.userService.uploadProfilePicture(file)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Erreur lors du téléversement de la photo.');
          return EMPTY;
        })
      )
      .subscribe(user => {
        this.user = user;
        this.signals.updateCurrentUser(user);
        this.notification.showSuccess('✅ Photo mise à jour avec succès !');
      });
  }

  onPhotoDeleted() {
    this.userService.deleteProfilePicture()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Erreur lors de la suppression de la photo.');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.user.profilePictureUrl = undefined;
        this.signals.updateCurrentUser(this.user);

        this.userService.getCurrentUser()
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            catchError(err => {
              this.errorHandler.handle(err, '❌ Erreur lors du rafraîchissement du profil.');
              return EMPTY;
            })
          )
          .subscribe(updatedUser => this.user = updatedUser);

        this.notification.showSuccess('✅ Photo supprimée avec succès.');
      });
  }
}
