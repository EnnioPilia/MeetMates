import { Component, Input, ChangeDetectionStrategy, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user/user.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <mat-card class="flex flex-col items-center gap-2 w-full mt-8 text-center relative">
      <div class="relative">
        <img
  [src]="user.profilePictureUrl || 'assets/default-avatar.png'"
  alt="Avatar"
  class="w-32 h-32 rounded-full object-cover border-2 border-black"
/>

        <button mat-icon-button color="primary"
          class="absolute bottom-0 right-0 bg-white rounded-full shadow border border-gray-300"
          style="width: 2rem; height: 2rem;" (click)="fileInput.click()">
          <mat-icon>add</mat-icon>
        </button>

        <input #fileInput type="file" accept="image/*" hidden (change)="onFileChange($event)" />
      </div>

      <p>{{ user.lastName }} {{ user.firstName }}</p>
      <p>{{ user.email }}</p>
    </mat-card>
  `,
})
export class ProfileCardComponent {
  @Input({ required: true }) user!: User;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private userService = inject(UserService);
  private notification = inject(NotificationService);

onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  this.userService.uploadProfilePicture(file).subscribe({
    next: (updatedUser) => {
      this.user.profilePictureUrl = updatedUser.profilePictureUrl; // ✅ mise à jour instantanée
      this.notification.showSuccess('✅ Photo de profil mise à jour !');
    },
    error: (err) => {
      console.error('Erreur upload image :', err);
      this.notification.showError('❌ Impossible de mettre à jour la photo.');
    },
  });
}

}
