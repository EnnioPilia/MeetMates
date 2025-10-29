import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user/user.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

@Component({
  selector: 'app-edit-profile-picture',
  standalone: true,
  imports: [CommonModule, MatIconModule, AppButtonComponent],
  template: `

    <div class="flex flex-col items-center">

        <img [src]="previewUrl || user.profilePictureUrl || 'assets/images/default-avatar.png'" alt="photo profil"class="w-32 h-32 rounded-full object-cover border-2 border-black" />
        <button mat-icon-button *ngIf="user?.profilePictureUrl" aria-label="Supprimer la photo" (click)="removePhoto()"class="relative bottom-5 left-20"><mat-icon>delete</mat-icon></button>

        <app-button label="Ajouter une photo" class="tertiary-button mb-3" type="button"(click)="fileInput.click()"></app-button>
        <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)" />

    </div>
  `
})
export class EditProfilePictureComponent {
  @Input() user!: User;
  @Output() userChange = new EventEmitter<User>();

  private userService = inject(UserService);
  private notification = inject(NotificationService);

  previewUrl: string | null = null;

  removePhoto(): void {
    this.userService.deleteProfilePicture().subscribe({
      next: () => {
        this.user.profilePictureUrl = undefined;
        this.previewUrl = null;
        this.userChange.emit(this.user);
        this.notification.showSuccess('🗑️ Photo supprimée avec succès.');
      },
      error: () => {
        this.notification.showError('Erreur lors de la suppression de la photo.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.previewUrl = URL.createObjectURL(file);

    this.userService.uploadProfilePicture(file).subscribe({
      next: (updatedUser) => {
        this.userChange.emit(updatedUser);
        this.previewUrl = null;
        this.notification.showSuccess('📸 Photo mise à jour avec succès !');
      },
      error: () => {
        this.notification.showError('Erreur lors du téléversement de la photo.');
      },
    });
  }
}
