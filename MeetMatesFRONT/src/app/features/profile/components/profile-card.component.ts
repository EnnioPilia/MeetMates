import { Component, Input, ChangeDetectionStrategy, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user/user.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule,AppButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <div class="flex flex-col items-center gap-2 w-full mt-8 text-center relative">

      <img [src]="previewUrl || user.profilePictureUrl || 'assets/images/default-avatar.png'" alt="photo" class="w-32 h-32 rounded-full object-cover border-2 border-black"/>

      <!-- <button mat-icon-button color="primary"class="absolute bottom-10 right-0"  [style.left.%]="28" (click)="fileInput.click()"><mat-icon>add</mat-icon></button> -->
      <!-- <app-button label="Ajouter une photo de profil" class="tertiary-button mb-3" type="button"(click)="fileInput.click()"></app-button> -->

      <a class="tertiary-box"  (click)="fileInput.click()">Ajouter une photo</a>
      <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)" />
    
      <p>{{ user.lastName }} {{ user.firstName }}</p><p>{{ user.email }}</p>

    </div>
  `,
})
export class ProfileCardComponent {
  @Input({ required: true }) user!: User;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  previewUrl: string | null = null;

  private userService = inject(UserService);
  private notification = inject(NotificationService);

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => (this.user = user),
      error: (err) => {
        console.error(err);
        this.notification.showError('Erreur de chargement du profil.');
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
        this.user = updatedUser; 
        this.previewUrl = null;
        this.notification.showSuccess('Photo mise à jour avec succès !');
      },
      error: (err) => {
        console.error(err);
        this.notification.showError('Erreur lors du téléversement de la photo.');
      },
    });
  }

}
