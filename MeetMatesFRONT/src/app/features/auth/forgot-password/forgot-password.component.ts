import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})

export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  isSubmitting = false;
  formSubmitted = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.notification.showWarning('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    this.isSubmitting = true;
    const { email } = this.form.value;

    this.authService.requestPasswordReset(email.trim().toLowerCase()).subscribe({
      next: (message) => {
        this.isSubmitting = false;
        this.notification.showSuccess(
          message || '✅ Un lien de réinitialisation a été envoyé à votre adresse e-mail.'
        );
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('[Auth] Erreur reset password :', err);

        if (err.status === 404) {
          this.notification.showWarning('Aucun compte associé à cet e-mail.');
        } else {
          this.notification.showError(
            err.error?.message || '❌ Une erreur est survenue. Veuillez réessayer.'
          );
        }
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
