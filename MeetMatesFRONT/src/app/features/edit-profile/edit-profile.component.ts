import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import { UserService } from '../../core/services/user/user.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';
import { EditProfilePictureComponent } from './components/edit-profile-picture.component';
import { EditProfileFormComponent } from './components/edit-profile-form.component';

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

  readonly error = signal<string | null>(null);
  readonly loadings = signal(true);
  user!: User;

  ngOnInit() {
    this.userService.getCurrentUser().pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
        this.loadings.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement du profil.');
        this.loadings.set(false);
      },
    });
  }

  onUserUpdated(user: User) {
    this.user = user;
    this.notification.showSuccess('✅ Profil enregistré avec succès !');
    setTimeout(() => this.router.navigate(['/profile']), 1000);
  }
}
