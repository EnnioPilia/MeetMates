import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserFacade } from '../../core/facades/user/user.facade';
import { User } from '../../core/models/user.model';

import { EditProfilePictureComponent } from './components/edit-profile-picture.component';
import { EditProfileFormComponent } from './components/edit-profile-form.component';
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    EditProfilePictureComponent,
    EditProfileFormComponent,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  private userFacade = inject(UserFacade);
  private destroyRef = inject(DestroyRef);

  readonly error = signal<string | null>(null);
  readonly loading = signal<boolean>(true);
  readonly user = signal<User | null>(null);

ngOnInit() {
  this.userFacade.getCurrentUser()
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(err => {
        this.error.set('Profil introuvable.');
        this.loading.set(false);
        return EMPTY;
      })
    )
    .subscribe(user => {   // ← user est déjà du type User | null
      if (!user) {
        this.error.set('Profil introuvable.');
        this.loading.set(false);
        return;
      }

      this.user.set(user);
      this.loading.set(false);
    });
}


onSave(formValue: Partial<User>) {
  this.userFacade.updateMyProfile(formValue)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(res => {
      const user = res?.data ?? null;  // ✅ extraction
      this.user.set(user);
    });
}

onPhotoSelected(file: File) {
  this.userFacade.uploadProfilePicture(file)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(res => {
      const user = res?.data ?? null;  // ✅ extraction
      this.user.set(user);
    });
}

onPhotoDeleted() {
  this.userFacade.deleteProfilePicture()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(res => {
      const current = this.user();
      if (current) {
        this.user.set({ ...current, profilePictureUrl: null });
      }
    });
}
}