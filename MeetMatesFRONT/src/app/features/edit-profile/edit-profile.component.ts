import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { User } from '../../core/models/user.model';
import { EditProfilePictureComponent } from './components/edit-profile-picture.component';
import { EditProfileFormComponent } from './components/edit-profile-form.component';
import { SignalsService } from '../../core/services/signals/signals.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    EditProfilePictureComponent,
    EditProfileFormComponent
  ],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  private userService = inject(UserService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private signals = inject(SignalsService);

  readonly error = signal<string | null>(null);
  readonly loadings = signal<boolean>(true);

  user!: User;

  ngOnInit() {
    this.userService.getCurrentUser().pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
        this.signals.updateCurrentUser(user);
        this.loadings.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement du profil.');
        this.loadings.set(false);
      },
    });
  }

  onSave(formValue: Partial<User>) {
    this.userService.updateMyProfile({ ...this.user, ...formValue }).subscribe({
      next: (user) => {
        this.user = user;
        this.signals.updateCurrentUser(user); 
        this.notification.showSuccess('✅ Profil enregistré avec succès !');
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.notification.showError('❌ Erreur lors de la mise à jour du profil.');
      },
    });
  }

  onPhotoSelected(file: File) {
    this.userService.uploadProfilePicture(file).subscribe({
      next: (user) => {
        this.user = user;
        this.signals.updateCurrentUser(user); 
        this.notification.showSuccess('Photo mise à jour avec succès !');
      },
      error: () => {
        this.notification.showError('Erreur lors du téléversement de la photo.');
      },
    });
  }

  onPhotoDeleted() {
    this.userService.deleteProfilePicture().pipe(take(1)).subscribe({
      next: () => {
        this.user.profilePictureUrl = undefined;
        this.signals.updateCurrentUser(this.user);

        this.userService.getCurrentUser().pipe(take(1)).subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
          },
        });

        this.notification.showSuccess('Photo supprimée avec succès.');
      },
      error: () => {
        this.notification.showError('Erreur lors de la suppression de la photo.');
      },
    });
  }
}
