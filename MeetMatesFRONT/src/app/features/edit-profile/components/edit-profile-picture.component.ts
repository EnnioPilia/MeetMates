import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-edit-profile-picture',
  standalone: true,
  imports: [CommonModule, MatIconModule, AppButtonComponent],
  template: `
    <div class="flex flex-col items-center">
      <img 
        [src]="previewUrl || user.profilePictureUrl || 'assets/images/default-avatar.png'" 
        alt="photo profil"
        class="w-32 h-32 rounded-full object-cover border-2 border-black" />
      
      <button 
        mat-icon-button 
        *ngIf="user?.profilePictureUrl" 
        aria-label="Supprimer la photo" 
        (click)="onDelete()"
        class="relative bottom-5 left-20">
        <mat-icon>delete</mat-icon>
      </button>

      <app-button 
        label="Ajouter une photo" 
        class="tertiary-button mb-3" 
        type="button"
        (click)="fileInput.click()">
      </app-button>

      <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)" />
    </div>
  `
})
export class EditProfilePictureComponent {
  @Input({ required: true }) user!: User;
  @Output() photoSelected = new EventEmitter<File>();
  @Output() photoDeleted = new EventEmitter<void>();

  previewUrl: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.previewUrl = URL.createObjectURL(file);
    this.photoSelected.emit(file);
  }

  onDelete(): void {
    this.photoDeleted.emit();
  }
}
