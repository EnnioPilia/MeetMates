import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../../core/services/user/user.service';
import { User } from '../../../core/models/user.model';
import { AppInputComponent } from '../../../shared-components/input/input.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    AppInputComponent,
    AppButtonComponent
  ],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[calc(80vh-10px)] mt-10">
      <mat-card class="flex flex-col items-center gap-3" *ngIf="form">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col items-center gap-4">

          <app-input label="Prénom" [control]="form.get('firstName')!" type="text"></app-input>

          <app-input label="Nom" [control]="form.get('lastName')!" type="text"></app-input>

          <app-input label="Email" [control]="form.get('email')!" type="email"></app-input>

          <app-button label="Enregistrer les modifications" class="primary-button w-80" type="submit"[disabled]="loading || form.invalid"></app-button>

        </form>
      </mat-card>
    </div>
  `,
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  form!: FormGroup;
  user!: User;
  loading = false;

  ngOnInit() {
    this.userService.getCurrentUser().pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
        this.form = this.fb.group({
          firstName: [user.firstName, [Validators.required, Validators.minLength(1)]],
          lastName: [user.lastName, [Validators.required, Validators.minLength(1)]],
          email: [user.email, [Validators.required, Validators.email]],
        });
      },
      error: (err) => {
        console.error('Erreur de chargement utilisateur', err);
        this.notification.showError('Impossible de charger votre profil.');
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez corriger les erreurs du formulaire.');
      return;
    }

    this.loading = true;
    const updatedUser: User = { ...this.user, ...this.form.value };

    this.userService.updateMyProfile(updatedUser).subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess('✅ Profil enregistré avec succès !');

        setTimeout(() => this.router.navigate(['/profile']), 1000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur mise à jour profil :', err);
        this.notification.showError('❌ Erreur lors de la mise à jour du profil.');
      }
    });
  }
}
